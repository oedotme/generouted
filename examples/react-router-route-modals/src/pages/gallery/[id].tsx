import { useNavigate, useParams } from '@/router'

export default function GalleryId() {
  const params = useParams('/gallery/:id')
  const navigate = useNavigate()

  const onDismiss = () => navigate('/gallery')

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'grid', placeContent: 'center' }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: -1 }} onClick={onDismiss} />
      <div style={{ background: 'white', padding: 40, height: 300, width: 600 }}>
        <h2>Gallery Item — {params.id}</h2>
      </div>
    </div>
  )
}
