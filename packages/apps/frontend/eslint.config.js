//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import { orgReactEslintConfig } from '@org/eslint/react.js'

export default [
  ...orgReactEslintConfig,
  ...tanstackConfig
]
