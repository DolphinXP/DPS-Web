import {useVueFlow} from '@vue-flow/core'
import {h, ref, watch} from 'vue'
import {v4 as uuidv4} from 'uuid';
import {Modal, notification} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

let currentItem = null;
let isDoubleClickEventFired = false;

let posOffset = {x: 0, y: 0};
let newNode = {}

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
        position: {x: 500, y: 100},
    }

    const endNode = {
        id: 'end',
        label: 'Finish',
        type: 'output',
        position: {x: 500, y: 600},
    }

    const testNode = {
        id: 'test',
        label: 'Test',
        type: 'default',
        position: {x: 500, y: 200},

        style: {backgroundColor: 'rgba(16, 185, 129, 0.5)', width: '200px', height: '200px'},
    }


    const {
        onNodesInitialized, screenToFlowCoordinate, onNodesChange, onNodeDragStop,
        onConnectEnd, getIntersectingNodes, isNodeIntersecting,
        addNodes, updateNode, onNodeDoubleClick, getNodes, getViewport,
        removeNodes, removeEdges, getEdges, onEdgeDoubleClick,
        getElements
    } = useVueFlow()

    watch(isDragging, (dragging) => {
        document.body.style.userSelect = dragging ? 'none' : ''
    })

    function initialize(nodes) {
        if (!nodes) {
            addNodes([startNode, testNode, endNode]);
        } else {
            addNodes(nodes);
        }
    }


    onNodesChange((nodes) => {

    })

    function onDragStart(item, event, type) {
        currentItem = item;

        posOffset = {
            x: event.offsetX,
            y: event.offsetY,
        }


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


    /**
     * Handles the drop event.
     *
     * @param {DragEvent} event
     */
    function onDrop(event) {
        console.log(event)
        const position = screenToFlowCoordinate({
            x: event.clientX - posOffset.x,
            y: event.clientY - posOffset.y,
        })

        const nodeId = getId()

        newNode = {
            id: nodeId,
            type: draggedType.value,
            position,
            label: `${currentItem.Name}`,
            data: currentItem,
        }
        addNodes(newNode)

        // Mr. Tom
        setTimeout(() => {
            const intersectingNodes = getIntersectingNodes(newNode, true);
            intersectingNodes.forEach((parentNode) => {
                if (parentNode.id === 'test') {
                    updateNode(newNode.id, (me) => ({
                        parentNode: parentNode.id,
                        //extent: 'parent',
                        expandParent: true,
                        position: {
                            x: (me.position.x - parentNode.position.x),
                            y: (me.position.y - parentNode.position.y)
                        },
                        label: `${me.label}-${parentNode.label}`,
                    }));
                }
            })

        }, 300); // Delay in milliseconds

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
                notifyMessage('Incorrect connection, each node must go from input to output and can only be connected once.');
                removeEdges([edges[edges.length - 1]]);
            }
        }
        // Iterate through the object and log a message for each node that appears more than once
        for (const nodeId in targetConnected) {
            if (targetConnected[nodeId] > 1) {
                notifyMessage('Incorrect connection, each node must go from input to output and can only be connected once.');
                removeEdges([edges[edges.length - 1]]);
            }
        }

        edges.forEach((edge) => {
            edge.animated = true;
            edge.type = 'smoothstep';
        });

    })


    onNodeDoubleClick((event, node) => {
        if (event.node.id === 'start' || event.node.id === 'end') {
            return;
        }

        if (isDoubleClickEventFired) {
            return;
        }
        isDoubleClickEventFired = true;

        Modal.confirm({
            title: 'Delete Node',
            content: 'Are you sure to delete this node?',
            icon: h(ExclamationCircleOutlined, {style: 'color: red'}),
            onOk() {
                removeNodes([event.node]);
            }
        });

        setTimeout(() => {
            isDoubleClickEventFired = false;
        }, 300); // delay in ms

    })

    onEdgeDoubleClick((event, edge) => {
        if (isDoubleClickEventFired) {
            return;
        }
        isDoubleClickEventFired = true;

        Modal.confirm({
            title: 'Delete Edge',
            content: 'Are you sure to delete this edge?',
            icon: h(ExclamationCircleOutlined, {style: 'color: red'}),
            onOk() {
                removeEdges([event.edge]);
            }
        });

        setTimeout(() => {
            isDoubleClickEventFired = false;
        }, 300); // delay in ms

    })

    function notifyMessage(description) {
        notification.open({
            message: `Warning`,
            description: description,
            placement: 'top',
            icon: () => h(ExclamationCircleOutlined, {style: 'color: red'}),
        });
    }

    function getOrderedNodes() {
        const elems = getElements.value;
        let extractedData;
        extractedData = getElements.value.map(elem => {
            return {
                id: elem.id,
                label: elem.label,
                type: elem.type,
                position: elem.position,
                parentNode: elem.parentNode,
                data: elem.data,
                dimensions: elem.dimensions,
                animated: elem.animated,
                isParent: elem.isParent,
                source: elem.sourceNode?.id,
                target: elem.targetNode?.id,
                style: elem.style,
            }
        });

        return extractedData;
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
        getOrderedNodes,
    }
}
