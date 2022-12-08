import { SystemResponse } from "./engine";

export class Node<T> {
  data?: T;
  //   key: string;
  //   left?: Node<T>;
  //   right?: Node<T>;
  parent?: Node<T>;
  children: Node<T>[];

  constructor(data: {
    // key: string;
    // left?: Node<T>;
    // right?: Node<T>;
    parent?: Node<T>;
    data?: T;
    children?: Node<T>[];
  }) {
    this.data = data.data;
    // this.left = data.left;
    // this.right = data.right;
    this.parent = data.parent;
    // this.key = data.key;
    this.children = data.children ?? [];
  }
}

export class Tree<T> {
  root: Node<T>;
  //   nodes: Map<string, Node<T>>;

  constructor(root: Node<T>) {
    this.root = root;
    // this.nodes = new Map<string, Node<T>>();
    // this.nodes.set(root.key, root);
  }

  //   addNode(node: Node<T>, parent: Node<T>) {

  //   }
}
