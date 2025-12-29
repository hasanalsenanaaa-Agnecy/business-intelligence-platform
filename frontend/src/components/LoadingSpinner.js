// frontend/src/components/LoadingSpinner.js
const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <CircularProgress />
    <Typography sx={{ mt: 2 }}>جاري التحميل...</Typography>
  </div>
);