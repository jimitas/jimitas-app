import * as se from "src/components/se";

// グローバルスコープでdragged変数を管理（複数コンポーネント間で共有しないように注意）
let globalDragged: HTMLElement | null = null;

export const useDragDrop = (onDropCallback?: () => void) => {
  // ドラッグ開始の操作
  function dragStart(e: DragEvent) {
    const target = e.target as HTMLElement;
    if (target.draggable === true) {
      globalDragged = target;
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

    // デバッグ用アラート（ドロップ位置の確認）
    // alert(`ドロップテスト\nターゲット要素: ${target.tagName}\nクラス: ${target.className}\nglobalDragged存在: ${globalDragged ? 'あり' : 'なし'}\nglobalDragged内容: ${globalDragged?.textContent || 'なし'}`);

    // droppable-elemクラスを持つ要素を探す（バブリング対応）
    let dropTarget = target;
    let attempts = 0;
    while (dropTarget && attempts < 5) {
      if (dropTarget.className && dropTarget.className.match(/droppable-elem/)) {
        break;
      }
      dropTarget = dropTarget.parentElement as HTMLElement;
      attempts++;
    }

    // ドロップ可能な要素が見つかったか確認
    // const isDroppable = dropTarget && dropTarget.className.match(/droppable-elem/);
    // alert(`ドロップ可能判定\ndroppable要素: ${isDroppable ? '見つかった' : '見つからない'}\n要素: ${dropTarget?.tagName || 'なし'}\nクラス: ${dropTarget?.className || 'なし'}`);

    // parentNodeの存在確認を詳細に
    //   element: globalDragged,
    //   parentNode: globalDragged?.parentNode,
    //   parentId: globalDragged?.parentNode && 'id' in globalDragged.parentNode ? globalDragged.parentNode.id : 'なし',
    //   isConnected: globalDragged?.isConnected
    // });

    if (dropTarget && dropTarget.className.match(/droppable-elem/) && globalDragged) {
      // alert('ドロップ実行します！');

      // 親要素が存在する場合のみremoveChild
      if (globalDragged.parentNode) {
        globalDragged.parentNode.removeChild(globalDragged);
      }

      // 要素を複製して新しく追加（元の要素が既に削除されている可能性があるため）
      const clonedElement = globalDragged.cloneNode(true) as HTMLElement;
      clonedElement.setAttribute("draggable", "true");
      clonedElement.className = globalDragged.className;

      dropTarget.appendChild(clonedElement);
      se.pi.play();

      // グローバル変数をクリア
      globalDragged = null;

      // コールバック関数を実行（コンポーネント固有の処理）
      if (onDropCallback) {
        onDropCallback();
      }
    } else {
      // alert(`ドロップ失敗\n理由:\n- droppable要素: ${dropTarget ? 'あり' : 'なし'}\n- globalDragged: ${globalDragged ? 'あり' : 'なし'}`);
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
      // グローバル変数もクリア
      globalDragged = null;
      // コールバック関数を実行（コンポーネント固有の処理）
      if (onDropCallback) {
        onDropCallback();
      }
    }
  }

  return { dragStart, dragOver, dropEnd, touchStart, touchMove, touchEnd };
};