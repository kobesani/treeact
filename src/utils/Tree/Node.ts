export class Node {
    id: number;
    parent: Node | undefined = undefined;
    children: Node[] = [];
    height: number | undefined = undefined;
    branchLength: number | undefined = undefined;
    label: string | undefined = undefined;
    static numberOfNodes: number = 0;
  
    constructor(parent: Node | undefined) {
      this.id = Node.numberOfNodes;
      this.parent = parent;
      Node.numberOfNodes += 1;
    }
  
    toString = () => `node#${this.id}`;
  
    addChild = (child: Node): void => {
      this.children = [...this.children, child];
    };
  
    removeChild = (child: Node): void => {
      this.children = this.children.filter((node) => node.id === child.id);
    };
  
    isRoot = () => this.parent === undefined;
  
    isLeaf = () => this.children.length === 0;
  
    getAllNodes = (order: "preorder" | "postorder"): Node[] => {
      switch (order) {
        case "preorder":
          return [
            this,
            ...this.children.map((node) => node.getAllNodes(order)).flat(),
          ];
  
        case "postorder":
          return [
            ...this.children.map((node) => node.getAllNodes(order)).flat(),
            this,
          ];
  
        default:
          return [];
      }
    };
  
    getLeafNodes = (): Node[] =>
      // order doesn't matter; pre/post order returns the same
      this.getAllNodes("preorder").filter((node) => node.isLeaf());
  
    getDistanceToRoot = (): number =>
      this.parent && this.branchLength
        ? this.branchLength + this.parent.getDistanceToRoot()
        : 0;
  
    getMaxDistanceToRoot = (): number =>
      Math.max(...this.getLeafNodes().map((node) => node.getDistanceToRoot()));
  }
  
  // just another name for a Node
  export class Tree extends Node {
    constructor() {
      super(undefined)
    }
  }
  