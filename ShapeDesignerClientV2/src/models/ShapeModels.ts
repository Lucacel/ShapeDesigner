export type ApiShape = {
  x: number | string;
  y: number | string;
  label: string;
  shapeType: "circle" | "diamond" | "triangle";
};

export type MenuItem = {
  label: string;
  action: "delete" | "rename";
};

export abstract class ShapeObject {
  // Class members
  isMenuShowing: boolean;

  readonly x: number;
  readonly y: number;
  readonly label: string;

  readonly contextMenu: MenuItem[];

  constructor(x: number, y: number, label: string) {
    this.isMenuShowing = false;
    this.x = x;
    this.y = y;
    this.label = label;
    this.contextMenu = [
      {
        label: "Rename",
        action: "rename",
      },
      {
        label: "Delete",
        action: "delete",
      },
    ];
  }

  //Class methods

  /**
   * onClick
   */
  public onMenuItemPressed(
    action: "delete" | "rename",
    deleteCallback: (shape: ShapeObject) => void
  ) {
    switch (action) {
      case "delete":
        this.delete(deleteCallback);
        break;
      case "rename":
        this.rename();
        break;
      default:
        break;
    }
  }

  /**
   * rename
   */
  public rename() {
    console.log(`SELECTED SHAPE: \nlabel: ${this.label}`);
  }

  /**
   * delete
   */
  public delete(deleteCallback: (shape: ShapeObject) => void) {
    deleteCallback(this);
  }

  //Class abstract methods
  abstract renderShape(): string;
}

export class Circle extends ShapeObject {
  renderShape(): string {
    return `
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="23" stroke="#D63864" stroke-width="2" />
    </svg>
    `;
  }
}

export class Diamond extends ShapeObject {
  renderShape(): string {
    return `
    <svg
      width="46"
      height="46"
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23 1.41421L44.5858 23L23 44.5858L1.41421 23L23 1.41421Z"
        stroke="#4350AF"
        stroke-width="2"
        stroke-linejoin="round"
      />
    </svg>
    `;
  }
}

export class Triangle extends ShapeObject {
  renderShape(): string {
    // const component = createVNode()
    return `
      <svg
        width="52"
        height="44"
        viewBox="0 0 52 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M26 1L50.2487 43H1.75129L26 1Z"
          stroke="#424242"
          stroke-width="2"
          stroke-linejoin="round"
        />
      </svg>
    `;
  }
}
