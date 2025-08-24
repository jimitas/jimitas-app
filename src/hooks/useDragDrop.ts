import * as se from "src/components/se";

export const useDragDrop = (onDropCallback?: () => void) => {
  let dragged: HTMLElement | null = null;

  // ドラッグ開始の操作
  function dragStart(e: DragEvent) {
    const target = e.target as HTMLElement;
    if (target.draggable === true) {
      dragged = target;
    }
  }

  // ドラッグ中の操作
  function dragOver(e: DragEvent) {
    e.preventDefault();
  }

  // ドラッグ終了後の操作
  function dropEnd(e: DragEvent) {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.className.match(/droppable-elem/) && dragged && dragged.parentNode) {
      dragged.parentNode.removeChild(dragged);
      target.appendChild(dragged);
      se.kako.play();
      // コールバック関数を実行（コンポーネント固有の処理）
      if (onDropCallback) {
        onDropCallback();
      }
    }
  }

  // タッチ開始の操作
  function touchStart(e: TouchEvent) {
    e.preventDefault();
  }

  // ドラッグ中の操作
  function touchMove(e: TouchEvent) {
    e.preventDefault();
    const draggedElem = e.target as HTMLElement;
    const touch = e.changedTouches[0];
    draggedElem.style.position = "fixed";
    draggedElem.style.top = touch.pageY - window.pageYOffset - draggedElem.offsetHeight / 2 + "px";
    draggedElem.style.left = touch.pageX - window.pageXOffset - draggedElem.offsetWidth / 2 + "px";
  }

  // ドラッグ終了後の操作
  function touchEnd(e: TouchEvent) {
    e.preventDefault();
    const droppedElem = e.target as HTMLElement;
    droppedElem.style.position = "";
    droppedElem.style.top = "";
    droppedElem.style.left = "";
    const touch = e.changedTouches[0];
    const newParentElem = document.elementFromPoint(
      touch.pageX - window.pageXOffset,
      touch.pageY - window.pageYOffset
    ) as HTMLElement | null;

    if (newParentElem && newParentElem.className.match(/droppable-elem/)) {
      newParentElem.appendChild(droppedElem);
      se.kako.play();
      // コールバック関数を実行（コンポーネント固有の処理）
      if (onDropCallback) {
        onDropCallback();
      }
    }
  }

  return { dragStart, dragOver, dropEnd, touchStart, touchMove, touchEnd };
};