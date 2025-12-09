import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * 自动滚动钩子
 * @returns {{
 *   autoScrollRef: React.RefObject, // 容器ref，用于绑定到需要自动滚动的元素
 *   bindScroll: (newPixelsPerSecond?: number, newScrollDuration?: number, newPauseDuration?: number, newBottomWaitDuration?: number) => void
 * }} 返回容器ref和重新绑定函数
 */
const useAutoScroll = () => {
  // 容器ref，用于绑定到需要自动滚动的DOM元素
  const autoScrollRef = useRef(null);
  // 鼠标悬停暂停状态
  const [isPaused, setIsPaused] = useState(false);
  // 滚动过程中的间歇性暂停状态
  const [isIntervalPaused, setIsIntervalPaused] = useState(true); // 初始设置为true，开始时就暂停
  // 当前滚动位置（像素值）
  const scrollPositionRef = useRef(0);
  // 上次暂停的时间戳
  const lastPauseTimeRef = useRef(0);
  // 绑定标志，用于触发重新绑定效果
  const [bindFlag, setBindFlag] = useState(0);
  // 是否已经滚动到底部的标志
  const hasReachedBottomRef = useRef(false);
  // 是否需要重置到顶部的标志
  const shouldResetToTopRef = useRef(false);
  // 使用ref存储可变的滚动参数，避免依赖变化导致重渲染
  const paramsRef = useRef({
    pixelsPerSecond: null,      // 每秒滚动像素数
    scrollDuration: null,      // 每次连续滚动的持续时间（秒）
    pauseDuration: null,       // 每次滚动后的暂停时间（秒）
    bottomWaitDuration: null   // 触底时的等待时间（秒）
  });

  /**
   * 重新绑定滚动参数
   * @param {number} newPixelsPerSecond - 新的每秒滚动像素数
   * @param {number} newScrollDuration - 新的连续滚动持续时间（秒）
   * @param {number} newPauseDuration - 新的暂停时间（秒）
   * @param {number} newBottomWaitDuration - 新的触底等待时间（秒）
   */
  const bindScroll = useCallback((
    newPixelsPerSecond = paramsRef.current.pixelsPerSecond,
    newScrollDuration = paramsRef.current.scrollDuration,
    newPauseDuration = paramsRef.current.pauseDuration,
    newBottomWaitDuration = paramsRef.current.bottomWaitDuration
  ) => {
    // 更新滚动参数
    paramsRef.current = {
      pixelsPerSecond: newPixelsPerSecond ?? 60,
      scrollDuration: newScrollDuration ?? 0.5,
      pauseDuration: newPauseDuration ?? 1,
      bottomWaitDuration: newBottomWaitDuration ?? newPauseDuration ?? 1
    };

    // 重置滚动位置
    scrollPositionRef.current = 0;
    if (autoScrollRef.current) {
      autoScrollRef.current.scrollTop = 0;
    }

    // 重置状态
    setIsIntervalPaused(true); // 重新绑定后也先暂停
    lastPauseTimeRef.current = performance.now(); // 记录当前时间作为暂停开始时间
    hasReachedBottomRef.current = false;
    shouldResetToTopRef.current = false;

    // 触发重新绑定效果
    setBindFlag(prev => prev + 1);
  }, []);

  useEffect(() => {
    const container = autoScrollRef.current;
    if (!container) return;

    let animationId; // 用于存储requestAnimationFrame的ID
    const maxScroll = container.scrollHeight - container.clientHeight; // 最大可滚动距离
    let lastTime = 0; // 上次动画帧的时间戳
    let accumulatedScrollTime = 0; // 累计滚动时间（用于间歇性暂停）

    /**
     * 滚动动画函数
     * @param {number} timestamp - 当前时间戳
     */
    const scroll = (timestamp) => {
      if (
        paramsRef.current.pauseDuration == null || 
        paramsRef.current.pixelsPerSecond == null || 
        paramsRef.current.scrollDuration == null ||
        paramsRef.current.bottomWaitDuration == null
      ) {
        return;
      }

      if (!lastTime) {
        lastTime = timestamp;
        // 如果是第一次运行，设置暂停开始时间为当前时间
        if (isIntervalPaused && lastPauseTimeRef.current === 0) {
          lastPauseTimeRef.current = timestamp;
        }
      }
      const deltaTime = timestamp - lastTime; // 计算时间差
      lastTime = timestamp;

      // 如果没有可滚动内容或处于暂停状态，直接继续下一帧
      if (maxScroll <= 0 || isPaused) {
        animationId = requestAnimationFrame(scroll);
        return;
      }

      // 处理间歇性停顿
      if (isIntervalPaused) {
        // 检查暂停时间是否结束
        const currentPauseDuration = hasReachedBottomRef.current 
          ? paramsRef.current.bottomWaitDuration 
          : paramsRef.current.pauseDuration;
        
        if (timestamp - lastPauseTimeRef.current >= currentPauseDuration * 1000) {
          setIsIntervalPaused(false);
          accumulatedScrollTime = 0;

          // 如果需要重置到顶部（之前已经到达底部）
          if (shouldResetToTopRef.current) {
            scrollPositionRef.current = 0;
            container.scrollTop = 0;
            hasReachedBottomRef.current = false;
            shouldResetToTopRef.current = false;
          }
        }
      } else {
        // 累积滚动时间
        accumulatedScrollTime += deltaTime;

        // 检查是否达到连续滚动时间限制
        if (accumulatedScrollTime >= paramsRef.current.scrollDuration * 1000) {
          // 开始间歇性暂停
          setIsIntervalPaused(true);
          lastPauseTimeRef.current = timestamp;

          // 如果已经到达底部，标记需要在下次停顿结束后重置到顶部
          if (hasReachedBottomRef.current) {
            shouldResetToTopRef.current = true;
          }
        } else {
          // 只有在未到达底部时才继续滚动
          if (!hasReachedBottomRef.current) {
            // 计算本次帧应该滚动的像素数
            const deltaPixels = (paramsRef.current.pixelsPerSecond * deltaTime) / 1000;
            scrollPositionRef.current += deltaPixels;

            // 检查是否到达底部
            if (scrollPositionRef.current >= maxScroll) {
              // 到达底部，标记但不要立即重置
              hasReachedBottomRef.current = true;
              scrollPositionRef.current = maxScroll;
              container.scrollTop = maxScroll;
            } else {
              // 正常滚动
              container.scrollTop = scrollPositionRef.current;
            }
          }
        }
      }

      // 继续下一帧
      animationId = requestAnimationFrame(scroll);
    };

    // 初始化滚动位置并开始动画
    scrollPositionRef.current = container.scrollTop;
    animationId = requestAnimationFrame(scroll);

    // 鼠标悬停事件处理
    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    // 添加事件监听
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 清理函数
    return () => {
      // 取消动画帧
      cancelAnimationFrame(animationId);
      // 移除事件监听
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isPaused, isIntervalPaused, bindFlag]); // 依赖项

  // 返回容器ref和重新绑定函数
  return { autoScrollRef, bindScroll };
};

export default useAutoScroll;