import { ref } from 'vue'

export const useColors = () => {
  const defaultColors = [
    '#dc3545',
    '#007bff',
    '#28a745',
    '#ffc107',
    '#6f42c1',
    '#fd7e14',
    '#20c997',
    '#e83e8c',
    '#6c757d',
    '#17a2b8'
  ]

  const currentColorIndex = ref(0)

  const getNextColor = (): string => {
    const color = defaultColors[currentColorIndex.value]
    currentColorIndex.value = (currentColorIndex.value + 1) % defaultColors.length
    return color
  }

  const getRandomColor = (): string => {
    return defaultColors[Math.floor(Math.random() * defaultColors.length)]
  }

  return {
    defaultColors,
    getNextColor,
    getRandomColor
  }
}
