export interface PrometheusMetric {
    [key: string]: string;
}

export interface PrometheusValue {
    metric: PrometheusMetric;
    value: [number, string];
}

export interface PrometheusResult {
    resultType: 'vector' | 'matrix' | 'scalar' | 'string';
    result: PrometheusValue[];
}

export interface PrometheusResponse {
    status: 'success' | 'error';
    data: PrometheusResult;
}

export interface PrometheusQueryResult {
    [key: string]: PrometheusResponse;
}
