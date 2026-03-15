import { Box, Button, Stack, Typography } from '@mui/material'

function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <Box
      sx={{
        py: 6,
        px: 3,
        textAlign: 'center',
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={1.5} alignItems="center">
        <Typography variant="h6">{title}</Typography>
        {message ? <Typography color="text.secondary">{message}</Typography> : null}
        {actionLabel && onAction ? (
          <Button variant="contained" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </Box>
  )
}

export default EmptyState
