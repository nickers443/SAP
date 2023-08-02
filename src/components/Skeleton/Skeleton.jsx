import React from 'react'
import ContentLoader from 'react-content-loader'

const Skeleton = ({ width, height, speed = 2 }) => (
  <ContentLoader
    speed={speed}
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb">
    <rect x="0" y="0" rx="5" ry="5" width={width} height={height} />
  </ContentLoader>
)

export default Skeleton
