import { useLayoutEffect, useRef } from "react";

function useLockBodyScroll(maxWidth?: number) {
	const maxWidthRef = useRef(maxWidth);
	useLayoutEffect(() => {
		// Get original body overflow
		// const originalBodyStyle = window.getComputedStyle(document.body).overflow;
		const originalStyle = !!document.scrollingElement ?
			window.getComputedStyle(document.scrollingElement).overflow : ''
		// Prevent scrolling on mount
		if (typeof maxWidthRef.current === "undefined" || window.innerWidth <= maxWidthRef.current) {
			// document.body.style.overflow = 'hidden';
			if (document.scrollingElement)
				(document.scrollingElement as HTMLElement).style.overflow = 'hidden';
		}
		// Re-enable scrolling on component unmount
		return () => {
			if (document.scrollingElement)
				(document.scrollingElement as HTMLElement).style.overflow = originalStyle;
		}
	}, []); // Empty array ensures effect is only run on mount and unmount
}

export default useLockBodyScroll;