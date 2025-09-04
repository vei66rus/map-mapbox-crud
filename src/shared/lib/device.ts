export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || isTouchDevice()
}

export const getDeviceType = (): 'desktop' | 'tablet' | 'mobile' => {
  if (isMobileDevice()) {
    const screenWidth = window.screen.width
    const screenHeight = window.screen.height
    const minDimension = Math.min(screenWidth, screenHeight)
    
    if (minDimension >= 768) {
      return 'tablet'
    } else {
      return 'mobile'
    }
  }
  return 'desktop'
}

export const shouldUseTouchEvents = (): boolean => {
  return isTouchDevice() && isMobileDevice()
}
