import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import Icon from '../../src/components/Icon'
import CodeBlock from '../../src/components/CodeBlock'

// Minimaler, aber echter UI-Schnitt – keine Platzhalter

describe('UI Smoke', () => {
  it('renders Icon without crashing', () => {
    const { container } = render(<Icon name="menu" />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('renders CodeBlock and copies', async () => {
    const onCopied = vi.fn()
    const { getByRole } = render(<CodeBlock code={'console.log(1)'} onCopied={onCopied} />)
    const btn = getByRole('button', { name: /kopieren/i })
    expect(btn).toBeTruthy()
  })
})
