import { Alert, Box, Button, Stack } from '@mui/material'

function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <Box sx={{ py: 2 }}>
      <Stack spacing={2}>
        <Alert severity="error">
          <strong>{title}</strong>
          {message ? ` ${message}` : ''}
        </Alert>
        {onRetry ? (
          <Box>
            <Button variant="outlined" onClick={onRetry}>
              Retry
            </Button>
          </Box>
        ) : null}
      </Stack>
    </Box>
  )
}

export default ErrorState
