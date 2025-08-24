import * as se from "src/components/se";

export const useDragDrop = (onDropCallback?: () => void) => {
  let dragged: HTMLElement | null = null;

  // ドラッグ開始の操作
  function dragStart(e: DragEvent) {
    const target = e.target as HTMLElement;
    console.log("Drag start:", {
      targetClass: target.className,
      draggable: target.draggable,
      tagName: target.tagName
    });
    if (target.draggable === true) {
      dragged = target;
      console.log("Dragged element set:", dragged);
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

    // デバッグ用ログ
    console.log("Drop event:", {
      targetClass: target.className,
      hasDroppableClass: target.className.match(/droppable-elem/),
      dragged: dragged,
      draggedParent: dragged?.parentNode,
      targetTag: target.tagName
    });

    // droppable-elemクラスを持つ要素、またはその親要素を探す
    let dropTarget = target;
    let attempts = 0;
    while (dropTarget && attempts < 3) {
      if (dropTarget.className && dropTarget.className.match(/droppable-elem/)) {
        break;
      }
      dropTarget = dropTarget.parentElement as HTMLElement;
      attempts++;
    }

    if (dropTarget && dropTarget.className.match(/droppable-elem/) && dragged && dragged.parentNode) {
      console.log("Executing drop on:", dropTarget.className);
      dragged.parentNode.removeChild(dragged);
      dropTarget.appendChild(dragged);
      se.pi.play();
      // コールバック関数を実行（コンポーネント固有の処理）
      if (onDropCallback) {
        onDropCallback();
      }
    } else {
      console.log("Drop failed - no valid target found");
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
      se.pi.play();
      // コールバック関数を実行（コンポーネント固有の処理）
      if (onDropCallback) {
        onDropCallback();
      }
    }
  }

  return { dragStart, dragOver, dropEnd, touchStart, touchMove, touchEnd };
};