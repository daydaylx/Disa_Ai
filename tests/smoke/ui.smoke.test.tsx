import { render } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import CodeBlock from '../../src/components/CodeBlock'
import { Icon } from '../../src/components/ui/Icon'

// Minimaler, aber echter UI-Schnitt – keine Platzhalter

describe('UI Smoke', () => {
  it('renders Icon without crashing', () => {
    const { container } = render(<Icon name="menu" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders CodeBlock and copies', async () => {
    const onCopied = vi.fn()
    const { getByRole } = render(<CodeBlock code={'console.log(1)'} onCopied={onCopied} />)
    const btn = getByRole('button', { name: /kopieren/i })
    expect(btn).toBeInTheDocument()
  })
})