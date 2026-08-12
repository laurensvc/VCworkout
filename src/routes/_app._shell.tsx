import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '../components/app-shell'

export const Route = createFileRoute('/_app/_shell')({ component: AppShell })
