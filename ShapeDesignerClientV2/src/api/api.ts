import {
  Circle,
  Diamond,
  Triangle,
  type ApiShape,
  type ShapeObject,
} from "@/models/ShapeModels";

export const convertIntoShapeObject = (
  data: ApiShape
): ShapeObject | undefined => {
  switch (data.shapeType) {
    case "circle":
      return new Circle(Number(data.x), Number(data.y), data.label);
      break;
    case "diamond":
      return new Diamond(Number(data.x), Number(data.y), data.label);
      break;
    case "triangle":
      return new Triangle(Number(data.x), Number(data.y), data.label);
      break;
    default:
      return undefined;
      break;
  }
};

export const getShapesFromApi = async (): Promise<ShapeObject[]> => {
  const shapes: ShapeObject[] = [];
  const response = await fetch("http://localhost:3000/shapes");
  const responseData = await response.json();
  for (let i = responseData.length - 1; i >= 0; i--) {
    const shapeData = responseData[i];
    const shapeObject = convertIntoShapeObject(shapeData);
    if (shapeObject) shapes.push(shapeObject);
  }
  return shapes;
};
