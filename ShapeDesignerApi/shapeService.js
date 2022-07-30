const createLabel = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


const createShape = (x, y) => {
    const randomShapeNr = Math.floor(Math.random() * 3);
    const randomLabelNr = Math.floor(Math.random() * 6);
    const label = createLabel(5+randomLabelNr);
      switch (randomShapeNr) {
        case 0:
          return { x: x, y: y, shapeType: "circle", label: label };
        case 1:
            return { x: x, y: y, shapeType: "diamond", label: label };
        case 2:
            return { x: x, y: y, shapeType: "triangle", label: label };
        default:
            return null
      }
}

module.exports = {createShape}