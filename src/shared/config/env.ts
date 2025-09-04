export const config = {
  mapbox: {
    token: import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoidmVpNjYiLCJhIjoiY21mM3JuamRsMDB5OTJrcGl3MXpsM2RwcCJ9.AxS_Q4ywreAEPneIh0kcTA',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [37.6176, 55.7558] as [number, number],
    zoom: 10
  }
}
