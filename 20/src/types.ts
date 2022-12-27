export type Stringable = {
  toString(): string;
};

export class Node<T extends Stringable> implements Node<T> {
  element: T;
  next?: Node<T>;

  constructor(element: T) {
    this.element = element;
    this.next = undefined;
  }
}

export class LinkedList<T extends Stringable> implements LinkedList<T> {
  private head?: Node<T>;
  private tail?: Node<T>;
  private size: number;

  constructor() {
    this.head = undefined;
    this.tail = undefined;
    this.size = 0;
  }

  static fromArray<T extends Stringable>(arr: T[]): LinkedList<T> {
    const linkedList = new LinkedList<T>();

    arr.forEach((item) => linkedList.add(item));

    return linkedList;
  }

  add(element: T): Node<T> {
    const newNode = new Node(element);
    if (this.size === 0) {
      this.head = newNode;
      this.tail = newNode;
      this.size++;
      return newNode;
    }
    if (!this.tail) {
      this.tail = newNode;
      return newNode;
    }
    this.tail.next = newNode;
    this.tail = newNode;
    return newNode;
  }
  insertAt(element: T, i: number): Node<T> {
    if (i < 0 || i > this.size) {
      throw new Error("Invalid index");
    }
    const newNode = new Node(element);
    let prev: Node<T> | undefined;
    let currentNode = this.head;
    if (i === 0) {
      newNode.next = this.head;
      this.head = newNode;
    } else {
      currentNode = this.head;
      var it = 0; // iterate over the list to find // the position to insert

      while (it < i) {
        it++;
        prev = currentNode;
        currentNode = currentNode?.next;
      } // adding an element

      newNode.next = currentNode;
      if (prev) prev.next = newNode;
    }
    this.size++;
    return newNode;
  }
  removeFrom(i: number) {
    if (i < 0 || i >= this.size) throw new Error("Invalid index");
    let curr: Node<T> | undefined, prev: Node<T> | undefined;
    let it = 0;

    curr = this.head;
    prev = curr;

    if (i === 0) {
      this.head = curr?.next;
    } else {
      while (it < i) {
        it++;
        prev = curr;
        curr = curr?.next;
      }

      if (prev) prev.next = curr?.next;
    }
    this.size--;

    return curr?.element;
  }
  removeElement(element: T): Node<T> | undefined {
    let current = this.head;
    let prev: Node<T> | undefined = undefined;
    while (current) {
      if (current.element === element) {
        if (prev == null) {
          this.head = current.next;
        } else {
          prev.next = current.next;
        }
        this.size--;
        return current;
      }
      prev = current;
      current = current.next;
    }
    return undefined;
  }
  indexOf(element: T): number {
    let count = 0;
    let current = this.head;
    while (current) {
      if (current.element === element) return count;
      count++;
      current = current.next;
    }
    return -1;
  }

  isEmpty(): boolean {
    return !this.size;
  }
  length(): number {
    return this.size;
  }
  toString(startNode: Node<T> | undefined = this.head): string {
    if (!startNode) return "<Empty Linked List>";
    return this._toString(startNode);
  }
  private _toString(currentNode: Node<T>): string {
    if (!currentNode.next) {
      return currentNode.element.toString();
    }
    return `${currentNode.element.toString()} -> ${this._toString(
      currentNode.next
    )}`;
  }
}
