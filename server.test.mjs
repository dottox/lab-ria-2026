import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createRuntimeConfigScript,
  getStaticRequestPath,
  isTransportConfigured,
} from './server.mjs'

test('transport config uses runtime environment without exposing secrets', () => {
  assert.equal(isTransportConfigured({}), false)
  assert.equal(
    isTransportConfigured({
      MONTEVIDEO_TRANSPORT_CLIENT_ID: 'client-id',
      MONTEVIDEO_TRANSPORT_CLIENT_SECRET: 'client-secret',
    }),
    true,
  )
  assert.match(
    createRuntimeConfigScript({
      MONTEVIDEO_TRANSPORT_CLIENT_ID: 'client-id',
      MONTEVIDEO_TRANSPORT_CLIENT_SECRET: 'client-secret',
    }),
    /"montevideoTransportConfigured":true/,
  )
})

test('static path resolver keeps SPA routes and rejects traversal', () => {
  assert.equal(getStaticRequestPath('/'), '/index.html')
  assert.equal(getStaticRequestPath('/events'), '/events')
  assert.equal(getStaticRequestPath('/assets/app.js'), '/assets/app.js')
  assert.equal(getStaticRequestPath('/../server.mjs'), null)
  assert.equal(getStaticRequestPath('/assets/../server.mjs'), null)
  assert.equal(getStaticRequestPath('/assets/%5C..%5Cserver.mjs'), null)
})
