import useGetModelerModules from './useGetModelerModule';

export default function useFocusElement() {
  const [canvas, selection, elementRegistry] = useGetModelerModules([
    'canvas',
    'selection',
    'elementRegistry',
  ]);

  const centerElement = (elementId: string) => {
    var bbox = elementRegistry?.get(elementId);
    var currentViewbox = canvas?.viewbox();

    var elementMid = {
      x: bbox.x + bbox.width / 2,
      y: bbox.y + bbox.height / 2,
    };

    canvas?.viewbox({
      x: elementMid.x - currentViewbox.width / 2,
      y: elementMid.y - currentViewbox.height / 2,
      width: currentViewbox.width,
      height: currentViewbox.height,
    });
  };

  const focusElement = (id: string) => {
    const element = elementRegistry?.get(id);
    selection?.select(element);
    centerElement(id);
  };

  return focusElement;
}
