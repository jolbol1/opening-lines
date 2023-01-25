import styles from '../styles/loading-dots.module.css'

export function LoadingDots({
  color = '#000',
  size = 'small',
}: {
  color: string
  size: string
}) {
  return (
    <span className={size === 'small' ? styles.loading2 : styles.loading}>
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
    </span>
  )
}
