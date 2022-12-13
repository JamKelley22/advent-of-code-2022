import { NodeData } from "./engine";

export class Queue<T> {
  queue: T[];
  constructor() {
    this.queue = [];
  }
  add = (item: T): number => {
    return this.queue.push(item);
  };
  remove = (): T | undefined => {
    return this.queue.shift();
  };
  isEmpty = (): boolean => {
    return this.queue.length === 0;
  };
}

// Graph and node implementation from https://ricardoborges.dev/data-structures-in-typescript-graph
export class Node<T> {
  data: T;
  adjacent: Node<T>[];
  comparator: (a: T, b: T) => number;
  constructor(data: T, comparator: (a: T, b: T) => number) {
    this.data = data;
    this.adjacent = [];
    this.comparator = comparator;
  }
  addAdjacent(node: Node<T>): void {
    this.adjacent.push(node);
  }
  removeAdjacent(data: T): Node<T> | null {
    const index = this.adjacent.findIndex(
      (node) => this.comparator(node.data, data) === 0
    );
    if (index > -1) {
      return this.adjacent.splice(index, 1)[0];
    }
    return null;
  }
}

export class NodeRecord<T> {
  node: Node<T>;
  connection?: Connection<T>;
  costSoFar: number;
  constructor(node: Node<T>, connection?: Connection<T>, costSoFar?: number) {
    this.node = node;
    this.connection = connection;
    this.costSoFar = costSoFar || 0;
  }
}

export class Connection<T> {
  fromNode: NodeRecord<T>;
  toNode: NodeRecord<T>;
  constructor(fromNode: NodeRecord<T>, toNode: NodeRecord<T>) {
    this.fromNode = fromNode;
    this.toNode = toNode;
  }
}

export class Graph<T> {
  nodes: Map<T, Node<T>> = new Map();
  comparator: (a: T, b: T) => number;
  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
  }

  getConnections(fromNode: Node<T>): Connection<T>[] {
    return (
      this.nodes.get(fromNode.data)?.adjacent.map((adj) => {
        return new Connection(
          new NodeRecord(fromNode, undefined, 0),
          new NodeRecord(adj, undefined, 0)
        );
      }) || []
    );
  }
  /**
  
     * Add a new node if it was not added before
     *
     * @param {T} data
     * @returns {Node<T>}
     */
  addNode(data: T): Node<T> {
    let node = this.nodes.get(data);
    if (node) return node;
    node = new Node(data, this.comparator);
    this.nodes.set(data, node);
    return node;
  }
  /**
   * Remove a node, also remove it from other nodes adjacency list
   *
   * @param {T} data
   * @returns {Node<T> | null}
   */
  removeNode(data: T): Node<T> | null {
    const nodeToRemove = this.nodes.get(data);
    if (!nodeToRemove) return null;
    this.nodes.forEach((node) => {
      node.removeAdjacent(nodeToRemove.data);
    });
    this.nodes.delete(data);
    return nodeToRemove;
  }
  /**
   * Create an edge between two nodes
   *
   * @param {T} source
   * @param {T} destination
   */
  addEdge(source: T, destination: T): void {
    const sourceNode = this.addNode(source);
    const destinationNode = this.addNode(destination);
    sourceNode.addAdjacent(destinationNode);
  }
  /**
   * Checks to see if an edge between two nodes exists
   *
   * @param {T} source
   * @param {T} destination
   */
  hasEdge(source: T, destination: T): boolean {
    const destNode = this.nodes.get(destination);
    const sourceNode = this.nodes.get(source);
    if (!destNode || !sourceNode) return false;
    return sourceNode.adjacent.includes(destNode);
  }
  /**
   * Remove an edge between two nodes
   *
   * @param {T} source
   * @param {T} destination
   */
  removeEdge(source: T, destination: T): void {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);
    if (sourceNode && destinationNode) {
      sourceNode.removeAdjacent(destination);
    }
  }
  /**
   * Depth-first search
   *
   * @param {T} data
   * @param {Map<T, boolean>} visited
   * @returns
   */
  private depthFirstSearchAux(node: Node<T>, visited: Map<T, boolean>): void {
    if (!node) return;
    visited.set(node.data, true);
    console.log(node.data);
    node.adjacent.forEach((item) => {
      if (!visited.has(item.data)) {
        this.depthFirstSearchAux(item, visited);
      }
    });
  }
  depthFirstSearch() {
    const visited: Map<T, boolean> = new Map();
    this.nodes.forEach((node) => {
      if (!visited.has(node.data)) {
        this.depthFirstSearchAux(node, visited);
      }
    });
  }

  minDistance(dist: number[], sptSet: boolean[]) {
    // Initialize min value
    let min = Number.MAX_SAFE_INTEGER;
    let min_index = -1;
    for (let v = 0; v < dist.length; v++) {
      if (sptSet[v] == false && dist[v] <= min) {
        min = dist[v];
        min_index = v;
      }
    }
    return min_index;
  }

  dijkstras() {
    // const sourceNode = this.nodes.get(source);
    // const destinationNode = this.nodes.get(destination);

    // let nodes = [...this.nodes].filter((node) => node[1] !== sourceNode);
    // // const srcIndex = nodes.findIndex((node) => checkEqual(node[0], source));
    // // nodes = [
    // //   nodes[srcIndex],
    // //   ...nodes.slice(0, srcIndex),
    // //   ...nodes.slice(srcIndex + 1),
    // // ];
    // nodes = [[source, sourceNode!], ...nodes];

    let nodes = [...this.nodes];
    // console.log(nodes.length);

    const startNode = nodes.find((node) => (node[0] as NodeData).isStart);
    nodes = nodes.filter((node) => node[0] !== startNode?.[0]);
    // console.log(nodes.length);
    nodes = [startNode!, ...nodes];
    // console.log(nodes.length);

    const first = nodes[0][0] as { i: number; j: number };
    // console.log(first.i, first.j);

    const dist = Array(nodes.length).fill(Number.MAX_SAFE_INTEGER);
    const sptSet = Array(nodes.length).fill(false);
    // console.log(sptSet.length);

    dist[0] = 0;

    // https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/
    // Find shortest path for all vertices
    for (let count = 0; count < nodes.length - 1; count++) {
      // Pick the minimum distance vertex
      // from the set of vertices not yet
      // processed. u is always equal to
      // src in first iteration.
      let u = this.minDistance(dist, sptSet); // Mark the picked vertex as processed
      //   if (u > 10000) console.log(u);

      sptSet[u] = true; // Update dist value of the adjacent // vertices of the picked vertex.
      for (let v = 0; v < nodes.length; v++) {
        // Update dist[v] only if is not in
        // sptSet, there is an edge from u
        // to v, and total weight of path
        // from src to v through u is smaller
        // than current value of dist[v]
        if (
          !sptSet[v] &&
          nodes[u][1].adjacent.includes(nodes[v][1]) &&
          //   graph[u][v] != 0 &&
          dist[u] != Number.MAX_SAFE_INTEGER &&
          dist[u] + 1 < dist[v]
        ) {
          //   console.log(dist[u]);

          dist[v] = dist[u] + 1;
        }
      }
    }
    return { dist: dist, nodes: nodes };
  }

  //   dijkstras(source: T, destination: T) {
  //     const sourceNode = this.nodes.get(source);
  //     const destinationNode = this.nodes.get(destination);

  //     if (!sourceNode) {
  //       throw new Error("Cannot find source Node");
  //     }
  //     if (!destinationNode) {
  //       throw new Error("Cannot find dest node");
  //     }

  //     // Init record for start node
  //     const startRecord = new NodeRecord(sourceNode, undefined, 0);

  //     // Init open and closed lists
  //     const open: NodeRecord<T>[] = [];
  //     open.push(startRecord);
  //     const closed: NodeRecord<T>[] = [];

  //     let current: NodeRecord<T> | undefined;
  //     let t = 0;

  //     // Itter through processing each node
  //     while (open.length > 0) {
  //       // Find smallest cost so far in open list
  //       current = open.sort((a, b) => a.costSoFar - b.costSoFar).shift()!;

  //       // If this is the goal, term
  //       if (current.node === destinationNode) {
  //         break;
  //       }

  //       // Otherwise get outgoing connections
  //       //   const connectedNodes = current?.node.adjacent || [];
  //       const connections = this.getConnections(current.node);
  //       //   console.log(connections.map((conn) => conn.fromNode.node.data));
  //       //   console.log(connections.map((conn) => conn.toNode.node.data));

  //       for (
  //         let connectionIndex = 0;
  //         connectionIndex < connections.length;
  //         connectionIndex++
  //       ) {
  //         const connection = connections[connectionIndex];
  //         const endNode = connection.toNode;

  //         const endNodeCost = current.costSoFar + 1; // cost is always 1
  //         const closedNodeRecord = closed.find(
  //           (nodeRec) => nodeRec.node === endNode.node
  //         );
  //         const openNodeRecord = open.find(
  //           (nodeRec) => nodeRec.node === endNode.node
  //         );
  //         let endNodeRecord: NodeRecord<T>;
  //         // If node is closed skip
  //         if (closedNodeRecord) continue;
  //         // Or if open and we've found a worse route
  //         else if (openNodeRecord) {
  //           endNodeRecord = openNodeRecord;
  //           if (openNodeRecord.costSoFar <= endNodeCost) continue;
  //         } else {
  //           //Unvisited node
  //           endNodeRecord = new NodeRecord(endNode.node);
  //         }
  //         endNodeRecord.costSoFar = endNodeCost;
  //         endNodeRecord.connection = connections[connectionIndex];
  //         if (!openNodeRecord) {
  //           open.push(endNodeRecord);
  //         }
  //       }
  //       open.splice(
  //         open.findIndex((nodeRecord) => nodeRecord === current),
  //         1
  //       );
  //       closed.push(current);
  //     }
  //     //Found goal or no nodes left
  //     if (current?.node !== destinationNode) {
  //       //   console.log(current?.node);

  //       return null;
  //     } else {
  //       const path = [];
  //       while (current?.node !== sourceNode) {
  //         const connection: Connection<T> = current!.connection!;
  //         path.push(connection);
  //         // current = current?.connection?.fromNode;
  //         current = connection.fromNode;
  //       }
  //       return path.reverse();
  //     }
  //   }

  /**
   * Breadth-first search
   *
   * @param {T} data
   * @returns
   */
  private breadthFirstSearchAux(node: Node<T>, visited: Map<T, boolean>): void {
    const queue: Queue<Node<T>> = new Queue();
    if (!node) return;
    queue.add(node);
    visited.set(node.data, true);
    while (!queue.isEmpty()) {
      node = queue.remove()!;
      if (!node) continue;
      console.log(node.data);
      node.adjacent.forEach((item) => {
        if (!visited.has(item.data)) {
          visited.set(item.data, true);
          queue.add(item);
        }
      });
    }
  }
  breadthFirstSearch() {
    const visited: Map<T, boolean> = new Map();
    this.nodes.forEach((node) => {
      if (!visited.has(node.data)) {
        this.breadthFirstSearchAux(node, visited);
      }
    });
  }
}
export function defaultComparator(a: number, b: number) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
