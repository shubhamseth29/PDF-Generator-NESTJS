// import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
// import {
//   CompositePropagator,
//   W3CBaggagePropagator,
//   W3CTraceContextPropagator
// } from '@opentelemetry/core';
// import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
// import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
// import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
// import { NodeSDK } from '@opentelemetry/sdk-node';
// import * as process from 'process';

// // To start Jaeger check documentation here https://www.jaegertracing.io/docs/1.29/getting-started/
// const otelSDK = new NodeSDK({
//   metricExporter: new PrometheusExporter({
//     port: 8081,
//   }),
//   metricInterval: 6000,
//   // spanProcessor: new BatchSpanProcessor(new JaegerExporter()),
//   contextManager: new AsyncLocalStorageContextManager(),
//   textMapPropagator: new CompositePropagator({
//     propagators: [
//       new JaegerPropagator(),
//       new W3CTraceContextPropagator(),
//       new W3CBaggagePropagator(),
//       new B3Propagator(),
//       new B3Propagator({
//         injectEncoding: B3InjectEncoding.MULTI_HEADER,
//       }),
//     ],
//   }),
//   instrumentations: [getNodeAutoInstrumentations()],
// });

// export default otelSDK;
// // You can also use the shutdown method to gracefully shut down the SDK before process shutdown
// // or on some operating system signal.
// process.on('SIGTERM', () => {
//   otelSDK
//     .shutdown()
//     .then(
//       () => console.log('SDK shut down successfully'),
//       (err) => console.log('Error shutting down SDK', err),
//     )
//     .finally(() => process.exit(0));
// });
