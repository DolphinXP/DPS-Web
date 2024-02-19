import {useVueFlow} from '@vue-flow/core'
import {ref, watch} from 'vue'
import {v4 as uuidv4} from 'uuid';


let currentItem = null;

/**
 * @returns {string} - A unique id.
 */
function getId() {
    return `nid_${uuidv4().substring(0, 6)}`
}

/**
 * In a real world scenario you'd want to avoid creating refs in a global scope like this as they might not be cleaned up properly.
 * @type {{draggedType: Ref<string|null>, isDragOver: Ref<boolean>, isDragging: Ref<boolean>}}
 */
const state = {
    /**
     * The type of the node being dragged.
     */
    draggedType: ref(null),
    isDragOver: ref(false),
    isDragging: ref(false),
}

export default function useDragAndDrop() {
    const {draggedType, isDragOver, isDragging} = state
    const startNode = {
        id: 'start',
        label: 'Start',
        type: 'input',
        position: {x: 100, y: 100},
    }

    const endNode = {
        id: 'end',
        label: 'Finish',
        type: 'output',
        position: {x: 100, y: 600},
    }

    let currentNode = null;
    let currentEdge = null;

    const {
        onNodesInitialized, screenToFlowCoordinate,
        onConnectEnd, onPaneClick,
        addNodes, updateNode, onNodeClick,
        removeNodes, removeEdges, getEdges, onEdgeClick,
        getElements
    } = useVueFlow()

    watch(isDragging, (dragging) => {
        document.body.style.userSelect = dragging ? 'none' : ''
    })

    function onDragStart(item, event, type) {
        currentItem = item;

        if (event.dataTransfer) {
            event.dataTransfer.setData('application/vueflow', type)
            event.dataTransfer.effectAllowed = 'move'
        }

        draggedType.value = type
        isDragging.value = true

        document.addEventListener('drop', onDragEnd)
    }

    /**
     * Handles the drag over event.
     *
     * @param {DragEvent} event
     */
    function onDragOver(event) {
        event.preventDefault()

        if (draggedType.value) {
            isDragOver.value = true

            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'move'
            }
        }
    }

    function onDragLeave() {
        isDragOver.value = false
    }

    function onDragEnd() {
        isDragging.value = false
        isDragOver.value = false
        draggedType.value = null
        document.removeEventListener('drop', onDragEnd)

    }

    onConnectEnd((event, edge) => {
        const edges = getEdges.value;

        // Create an object to store the count of occurrences for each node
        const sourceConnected = {};
        const targetConnected = {};
        // Iterate through the edges
        edges.forEach(edge => {
            // Increment the count for the sourceNode and targetNode
            sourceConnected[edge.sourceNode.id] = (sourceConnected[edge.sourceNode.id] || 0) + 1;
            targetConnected[edge.targetNode.id] = (targetConnected[edge.targetNode.id] || 0) + 1;
        });

        // Iterate through the object and log a message for each node that appears more than once
        for (const nodeId in sourceConnected) {
            if (sourceConnected[nodeId] > 1) {
                alert('Incorrect connection, each node must go from input to output and can only be connected once.');
                removeEdges([edges[edges.length - 1]]);
            }
        }
        // Iterate through the object and log a message for each node that appears more than once
        for (const nodeId in targetConnected) {
            if (targetConnected[nodeId] > 1) {
                alert('Incorrect connection, each node must go from input to output and can only be connected once.');
                removeEdges([edges[edges.length - 1]]);
            }
        }

        edges.forEach((edge) => {
            edge.animated = true;
        });

    })

    function showContextMenu(menu, event) {
        const contextMenu = document.getElementById(menu);
        contextMenu.style.top = `${event.event.clientY - 10}px`;
        contextMenu.style.left = `${event.event.clientX + 10}px`;
        contextMenu.style.display = 'block';
        contextMenu.style.visibility = 'visible';
        console.log(event);
    }

    function hideContextMenu(menu) {
        const contextMenu = document.getElementById(menu);
        contextMenu.style.visibility = 'hidden';
    }

    onPaneClick((event) => {
        hideContextMenu('nodeMenu');
        hideContextMenu('edgeMenu');
    });

    onNodeClick((event, node) => {
        showContextMenu('nodeMenu', event);
        currentNode = event.node;
    })

    function deleteNode() {
        if (currentNode) {
            removeNodes([currentNode]);
        }

        hideContextMenu('nodeMenu');
    }

    onEdgeClick((event, edge) => {
        showContextMenu('edgeMenu', event);
        currentEdge = event.edge;
    })

    function deleteEdge() {
        if (currentEdge) {
            removeEdges([currentEdge]);
        }
        hideContextMenu('edgeMenu');
    }

    function showElements() {
        const elems = getElements.value;
        let extractedData = elems.map(elem => {
            if ('sourceNode' in elem && 'targetNode' in elem) {
                return {
                    id: `${elem.id}-${elem.id}`,
                    sourceNode: elem.sourceNode,
                    targetNode: elem.targetNode,
                    elemType: 'edge',
                    data: '',
                };
            } else {
                return {id: elem.id, elemType: 'node', data: elem.data};
            }
        });

        // Filter out the edges
        const edges = extractedData.filter(item => item.elemType === 'edge');

        // Create a new array to hold the sorted nodes
        let sortedNodes = [];

        // Find the edge where the sourceNode is startNode
        let currentEdge = edges.find(edge => edge.sourceNode.id === 'start');

        // If not find sourceNode==startNode in whole edge list, make alert and return
        if (!currentEdge) {
            alert('No edge with sourceNode == startNode found');
            return;
        }

        // Add the sourceNode and targetNode to the sorted nodes array
        sortedNodes.push(currentEdge.sourceNode);
        sortedNodes.push(currentEdge.targetNode);

        console.log(extractedData);

        // Iteratively find the edge where the sourceNode is the previous targetNode
        while (currentEdge.targetNode.id !== 'end') {
            currentEdge = edges.find(edge => edge.sourceNode.id === currentEdge.targetNode.id);

            // If no edge found, make alert and return
            if (!currentEdge) {
                alert('No edge with sourceNode == previous targetNode found');
                return;
            }

            // Add the targetNode to the sorted nodes array
            sortedNodes.push(currentEdge.targetNode);
        }

        console.log(sortedNodes);
    }

    function initialize() {
        addNodes([startNode, endNode]);
    }

    /**
     * Handles the drop event.
     *
     * @param {DragEvent} event
     */
    function onDrop(event) {
        const position = screenToFlowCoordinate({
            x: event.clientX,
            y: event.clientY,
        })

        const nodeId = getId()

        const newNode = {
            id: nodeId,
            type: draggedType.value,
            position,
            label: `${nodeId}`, //`${currentItem.Name}`,
            data: currentItem,
        }

        /**
         * Align node position after drop, so it's centered to the mouse
         *
         * We can hook into events even in a callback, and we can remove the event listener after it's been called.
         */
        const {off} = onNodesInitialized(() => {
            updateNode(nodeId, (node) => ({
                position: {
                    x: node.position.x - node.dimensions.width / 2,
                    y: node.position.y - node.dimensions.height / 2
                },
            }))

            off()
        })

        addNodes(newNode)
    }

    return {
        initialize,
        draggedType,
        isDragOver,
        isDragging,
        onDragStart,
        onDragLeave,
        onDragOver,
        onDrop,
        deleteNode,
        deleteEdge,
        showElements,
    }
}
