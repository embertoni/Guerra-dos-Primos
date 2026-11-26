import { useEffect, useRef, useState, type PointerEvent } from 'react';

const initialCamera = { x: 0, y: 0, scale: 1 };
export function useMapNavigation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [camera, setCamera] = useState(initialCamera);
  const [dragging, setDragging] = useState(false);
  const gesture = useRef<{
    id: number;
    x: number;
    y: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    function wheel(event: WheelEvent) {
      event.preventDefault();
      const matrix = svg!.getScreenCTM();
      if (!matrix) return;
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
        matrix.inverse(),
      );
      const delta =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? svg!.clientHeight
            : 1);
      setCamera((current) => {
        const scale = Math.max(
          0.5,
          Math.min(8, current.scale * Math.exp(-delta * 0.0015)),
        );
        const ratio = scale / current.scale;
        return {
          scale,
          x: point.x - (point.x - current.x) * ratio,
          y: point.y - (point.y - current.y) * ratio,
        };
      });
    }
    svg.addEventListener('wheel', wheel, { passive: false });
    return () => svg.removeEventListener('wheel', wheel);
  }, []);

  function onPointerDown(event: PointerEvent<SVGSVGElement>) {
    if (event.button !== 0 || !event.isPrimary) return;
    suppressClick.current = false;
    gesture.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };
  }
  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x,
      dy = event.clientY - current.y;
    if (!current.moved && Math.hypot(dx, dy) < 4) return;
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return;
    current.moved = true;
    suppressClick.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    setCamera((camera) => ({
      ...camera,
      x: camera.x + dx / matrix.a,
      y: camera.y + dy / matrix.d,
    }));
    current.x = event.clientX;
    current.y = event.clientY;
  }
  function endGesture(event: PointerEvent<SVGSVGElement>) {
    if (gesture.current?.id !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    gesture.current = null;
    setDragging(false);
  }
  return {
    svgRef,
    camera,
    dragging,
    reset: () => setCamera(initialCamera),
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endGesture,
      onPointerCancel: endGesture,
      onClickCapture: (event: React.MouseEvent<SVGSVGElement>) => {
        if (suppressClick.current) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      onKeyDown: (event: React.KeyboardEvent<SVGSVGElement>) => {
        const step = 60;
        if (
          [
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown',
            '+',
            '-',
            '0',
          ].includes(event.key)
        ) {
          event.preventDefault();
          if (event.key === '0') setCamera(initialCamera);
          else
            setCamera((current) =>
              event.key === '+' || event.key === '-'
                ? {
                    ...current,
                    scale: Math.max(
                      0.5,
                      Math.min(
                        8,
                        current.scale * (event.key === '+' ? 1.2 : 1 / 1.2),
                      ),
                    ),
                  }
                : {
                    ...current,
                    x:
                      current.x +
                      (event.key === 'ArrowLeft'
                        ? step
                        : event.key === 'ArrowRight'
                          ? -step
                          : 0),
                    y:
                      current.y +
                      (event.key === 'ArrowUp'
                        ? step
                        : event.key === 'ArrowDown'
                          ? -step
                          : 0),
                  },
            );
        }
      },
    },
  };
}
