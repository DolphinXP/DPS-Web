import {useVueFlow} from '@vue-flow/core'
import {ref, watch} from 'vue'

let id = 0

/**
 * @returns {string} - A unique id.
 */
function getId() {
    return `dndnode_${id++}`
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

    function onDragStart(event, type) {
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
        const extractedData = elems.map(elem => {
            if ('sourceNode' in elem && 'targetNode' in elem) {
                return {
                    id: `${elem.sourceNode.id}-${elem.targetNode.id}`,
                    sourceNode: elem.sourceNode,
                    targetNode: elem.targetNode,
                    elemType: 'edge'
                };
            } else {
                return {id: elem.id, elemType: 'node'};
            }
        });
        console.log(extractedData);
        alert(extractedData);
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
            label: `[${nodeId}]`,
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
        draggedType,
        isDragOver,
        isDragging,
        onDragStart,
        onDragLeave,
        onDragOver,
        onDrop,
        deleteNode,
        deleteEdge,
        showNodeInfo: showElements,
    }
}
