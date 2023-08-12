import * as se from "src/components/se";
import { useCallback, useState } from "react";

export const useDragDrop = () => {
  var dragged;
  //ドラッグ開始の操作
  function dragStart(e) {
    if (e.target.draggable === true) {
      dragged = e.target;
    }
    // store a ref. on the dragged elem
  }
  //ドラッグ中の操作
  function dragOver(e) {
    // prevent default to allow drop
    e.preventDefault();
  }
  //ドラッグ終了後の操作
  function dropEnd(e) {
    // prevent default action (open as link for some elements)
    e.preventDefault();
    // move dragged elem to the selected drop target
    if (e.target.className.match(/droppable-elem/)) {
      dragged.parentNode.removeChild(dragged);
      e.target.appendChild(dragged);
      // setCount((count) => count + 1);
      se.kako.play();
    }
  }

  //タッチ開始の操作
  function touchStart(e) {
    //タッチによる画面スクロールを止める
    e.preventDefault();
  }

  //ドラッグ中の操作
  function touchMove(e) {
    e.preventDefault();
    //ドラッグ中のアイテムをカーソルの位置に追従
    var draggedElem = e.target;
    var touch = e.changedTouches[0];
    e.target.style.position = "fixed";
    e.target.style.top = touch.pageY - window.pageYOffset - draggedElem.offsetHeight / 2 + "px";
    e.target.style.left = touch.pageX - window.pageXOffset - draggedElem.offsetWidth / 2 + "px";
  }

  //ドラッグ終了後の操作
  function touchEnd(e) {
    e.preventDefault();
    //ドラッグ中の操作のために変更していたスタイルを元に戻す
    var droppedElem = e.target;
    droppedElem.style.position = "";
    e.target.style.top = "";
    e.target.style.left = "";
    //ドロップした位置にあるドロップ可能なエレメントに親子付けする
    var touch = e.changedTouches[0];
    //スクロール分を加味した座標に存在するエレメントを新しい親とする
    var newParentElem = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset);

    if (newParentElem.className.match(/droppable-elem/)) {
      newParentElem.appendChild(droppedElem);
      se.kako.play();
      // setCount((count) => count + 1);
    }
  }

  return { dragStart, dragOver, dropEnd, touchStart, touchMove, touchEnd };
};
