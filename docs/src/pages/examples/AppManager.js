import { useCallback, useEffect, useMemo, useState } from "react";
import Example from "../../components/Example";
import SpreadGrid from "react-spread-gird";

const appData = {
    'fetcher-eu-001': { tags: ['fetcher', 'eu', 'core'], startedAt: Date.now() - 60_000, stoppedAt: null, isRequired: true },
    'fetcher-eu-002': { tags: ['fetcher', 'eu', 'core'], startedAt: null, stoppedAt: Date.now() - 60_000, isRequired: true },
    'fetcher-apac-001': { tags: ['fetcher', 'apac', 'core'], startedAt: Date.now() - 120_000, stoppedAt: null, isRequired: true },
    'fetcher-us-001': { tags: ['fetcher', 'us', 'core'], startedAt: Date.now() - 80_000, stoppedAt: null, isRequired: true },
    'logger-eu-001': { tags: ['logger', 'eu', 'metrics'], startedAt: Date.now() - 4_000, stoppedAt: null, isRequired: false },
    'logger-apac-001': { tags: ['logger', 'apac', 'metrics'], startedAt: null, stoppedAt: Date.now() - 60_000, isRequired: false },
    'logger-us-001': { tags: ['logger', 'us', 'metrics'], startedAt: Date.now() - 80_000, stoppedAt: null, isRequired: false },
    'consolidator-comp-001': { tags: ['consolidator', 'global', 'core'], startedAt: Date.now() - 2_000_000, stoppedAt: null, isRequired: true },
    'reporter-eu-001': { tags: ['reporter', 'eu', 'metrics'], startedAt: null, stoppedAt: Date.now() - 60_000, isRequired: true },
    'reporter-us-001': { tags: ['reporter', 'us', 'metrics'], startedAt: null, stoppedAt: null, isRequired: true },
    'reporter-apac-001': { tags: ['reporter', 'apac', 'metrics'], startedAt: null, stoppedAt: Date.now() - 60_000, isRequired: true },
    'reporter-comp-001': { tags: ['reporter', 'global', 'metrics'], startedAt: null, stoppedAt: Date.now() - 60_000, isRequired: true },
    'reporter-comp-002': { tags: ['reporter', 'global', 'metrics'], startedAt: null, stoppedAt: Date.now() - 60_000, isRequired: true },
    'reporter-comp-003': { tags: ['reporter', 'global', 'metrics'], startedAt: null, stoppedAt: Date.now() - 60_000, isRequired: true },
    'reporter-comp-004': { tags: ['reporter', 'global', 'metrics'], startedAt: null, stoppedAt: Date.now() - 60_000, isRequired: true },
    'reporter-comp-005': { tags: ['reporter', 'global', 'metrics'], startedAt: null, stoppedAt: Date.now() - 60_000, isRequired: true },
    'reporter-comp-006': { tags: ['reporter', 'global', 'metrics'], startedAt: null, stoppedAt: Date.now() - 60_000, isRequired: true },
    'fetcher-eu-003': { tags: ['fetcher', 'eu', 'core'], startedAt: Date.now() - 180_000, stoppedAt: null, isRequired: true },
    'fetcher-apac-002': { tags: ['fetcher', 'apac', 'core'], startedAt: null, stoppedAt: Date.now() - 120_000, isRequired: true },
    'fetcher-us-002': { tags: ['fetcher', 'us', 'core'], startedAt: Date.now() - 160_000, stoppedAt: null, isRequired: true },
    'logger-eu-002': { tags: ['logger', 'eu', 'metrics'], startedAt: Date.now() - 8_000, stoppedAt: null, isRequired: false },
    'logger-apac-002': { tags: ['logger', 'apac', 'metrics'], startedAt: null, stoppedAt: Date.now() - 120_000, isRequired: false },
    'logger-us-002': { tags: ['logger', 'us', 'metrics'], startedAt: Date.now() - 160_000, stoppedAt: null, isRequired: false },
    'consolidator-comp-002': { tags: ['consolidator', 'global', 'core'], startedAt: Date.now() - 4_000_000, stoppedAt: null, isRequired: true },
    'reporter-eu-002': { tags: ['reporter', 'eu', 'metrics'], startedAt: null, stoppedAt: Date.now() - 120_000, isRequired: true },
    'reporter-us-002': { tags: ['reporter', 'us', 'metrics'], startedAt: null, stoppedAt: null, isRequired: true },
    'reporter-apac-002': { tags: ['reporter', 'apac', 'metrics'], startedAt: null, stoppedAt: Date.now() - 120_000, isRequired: true },
    'fetcher-eu-004': { tags: ['fetcher', 'eu', 'core'], startedAt: Date.now() - 300_000, stoppedAt: null, isRequired: true },
    'fetcher-apac-003': { tags: ['fetcher', 'apac', 'core'], startedAt: null, stoppedAt: Date.now() - 180_000, isRequired: true },
    'fetcher-us-003': { tags: ['fetcher', 'us', 'core'], startedAt: Date.now() - 240_000, stoppedAt: null, isRequired: true },
    'logger-eu-003': { tags: ['logger', 'eu', 'metrics'], startedAt: Date.now() - 12_000, stoppedAt: null, isRequired: false },
    'logger-apac-003': { tags: ['logger', 'apac', 'metrics'], startedAt: null, stoppedAt: Date.now() - 180_000, isRequired: false },
    'logger-us-003': { tags: ['logger', 'us', 'metrics'], startedAt: Date.now() - 240_000, stoppedAt: null, isRequired: false },
    'consolidator-comp-003': { tags: ['consolidator', 'global', 'core'], startedAt: Date.now() - 6_000_000, stoppedAt: null, isRequired: true },
    'reporter-eu-003': { tags: ['reporter', 'eu', 'metrics'], startedAt: null, stoppedAt: Date.now() - 180_000, isRequired: true },
    'reporter-us-003': { tags: ['reporter', 'us', 'metrics'], startedAt: null, stoppedAt: null, isRequired: true },
    'reporter-apac-003': { tags: ['reporter', 'apac', 'metrics'], startedAt: null, stoppedAt: Date.now() - 180_000, isRequired: true },
    'fetcher-eu-005': { tags: ['fetcher', 'eu', 'core'], startedAt: Date.now() - 360_000, stoppedAt: null, isRequired: true },
    'fetcher-apac-004': { tags: ['fetcher', 'apac', 'core'], startedAt: null, stoppedAt: Date.now() - 240_000, isRequired: true },
    'fetcher-us-004': { tags: ['fetcher', 'us', 'core'], startedAt: Date.now() - 320_000, stoppedAt: null, isRequired: true },
    'logger-eu-004': { tags: ['logger', 'eu', 'metrics'], startedAt: Date.now() - 16_000, stoppedAt: null, isRequired: false },
    'logger-apac-004': { tags: ['logger', 'apac', 'metrics'], startedAt: null, stoppedAt: Date.now() - 240_000, isRequired: false },
    'logger-us-004': { tags: ['logger', 'us', 'metrics'], startedAt: Date.now() - 320_000, stoppedAt: null, isRequired: false },
    'consolidator-comp-004': { tags: ['consolidator', 'global', 'core'], startedAt: Date.now() - 8_000_000, stoppedAt: null, isRequired: true },
    'reporter-eu-004': { tags: ['reporter', 'eu', 'metrics'], startedAt: null, stoppedAt: Date.now() - 240_000, isRequired: true },
    'reporter-us-004': { tags: ['reporter', 'us', 'metrics'], startedAt: null, stoppedAt: null, isRequired: true },
    'reporter-apac-004': { tags: ['reporter', 'apac', 'metrics'], startedAt: null, stoppedAt: Date.now() - 240_000, isRequired: true },
    'fetcher-eu-006': { tags: ['fetcher', 'eu', 'core'], startedAt: Date.now() - 420_000, stoppedAt: null, isRequired: true },
    'fetcher-apac-005': { tags: ['fetcher', 'apac', 'core'], startedAt: null, stoppedAt: Date.now() - 300_000, isRequired: true },
    'fetcher-us-005': { tags: ['fetcher', 'us', 'core'], startedAt: Date.now() - 380_000, stoppedAt: null, isRequired: true },
    'logger-eu-005': { tags: ['logger', 'eu', 'metrics'], startedAt: Date.now() - 20_000, stoppedAt: null, isRequired: false },
    'logger-apac-005': { tags: ['logger', 'apac', 'metrics'], startedAt: null, stoppedAt: Date.now() - 300_000, isRequired: false },
    'logger-us-005': { tags: ['logger', 'us', 'metrics'], startedAt: Date.now() - 380_000, stoppedAt: null, isRequired: false },
    'fetcher-eu-007': { tags: ['fetcher', 'eu', 'core'], startedAt: Date.now() - 480_000, stoppedAt: null, isRequired: true },
    'fetcher-apac-006': { tags: ['fetcher', 'apac', 'core'], startedAt: null, stoppedAt: Date.now() - 360_000, isRequired: true },
    'fetcher-us-006': { tags: ['fetcher', 'us', 'core'], startedAt: Date.now() - 440_000, stoppedAt: null, isRequired: true },
    'logger-eu-006': { tags: ['logger', 'eu', 'metrics'], startedAt: Date.now() - 24_000, stoppedAt: null, isRequired: false },
    'logger-apac-006': { tags: ['logger', 'apac', 'metrics'], startedAt: null, stoppedAt: Date.now() - 360_000, isRequired: false },
    'logger-us-006': { tags: ['logger', 'us', 'metrics'], startedAt: Date.now() - 440_000, stoppedAt: null, isRequired: false },
    'consolidator-comp-006': { tags: ['consolidator', 'global', 'core'], startedAt: Date.now() - 10_000_000, stoppedAt: null, isRequired: true },
    'reporter-eu-006': { tags: ['reporter', 'eu', 'metrics'], startedAt: null, stoppedAt: Date.now() - 360_000, isRequired: true },
    'reporter-us-006': { tags: ['reporter', 'us', 'metrics'], startedAt: null, stoppedAt: null, isRequired: true },
    'reporter-apac-006': { tags: ['reporter', 'apac', 'metrics'], startedAt: null, stoppedAt: Date.now() - 360_000, isRequired: true },
    'fetcher-eu-008': { tags: ['fetcher', 'eu', 'core'], startedAt: Date.now() - 540_000, stoppedAt: null, isRequired: true },
};

export default function AppManager() {
    const [data, setData] = useState(appData);
    const [index, setIndex] = useState(0);
    const columns = useMemo(() => [
        { id: 'status', header: '', width: 25, labels: ['not-filterable'] },
        { id: 'name', header: 'Name' },
        { id: 'start', header: '', width: 30, labels: ['button', 'not-filterable'] },
        { id: 'restart', header: '', width: 30, labels: ['button', 'not-filterable'] },
        { id: 'stop', header: '', width: 30, labels: ['button', 'not-filterable'] },
        { id: 'startedAt', header: 'Started', labels: ['time'] },
        { id: 'stoppedAt', header: 'Stopped', labels: ['time'] },
        { id: 'isRequired', header: 'Required' },
        { id: 'tags', header: 'Tags' }
    ], []);
    const rows = useMemo(() => [
        { type: 'HEADER' },
        { type: 'FILTER' },
        { type: 'DATA-BLOCK' },
        { type: 'CUSTOM', id: 'summary' }
    ], []);
    const formatting = useMemo(() => [
        {
            column: { id: 'status' },
            value: ({ data, row }) => {
                if (data[row.id].stoppedAt) return 'stopped';
                if (data[row.id].startedAt) return 'running';
                return 'inactive';
            },
            style: ({ value }) => {
                switch (value) {
                    case 'running': return { background: '#3d9943' };
                    case 'stopped': return { background: '#ff5454' };
                    default: return { background: '#ededed' };
                }
            },
            text: ''
        },
        {
            column: { id: 'name' },
            value: ({ row }) => row.id,
        },
        {
            row: { id: 'summary' },
            text: '',
            style: { background: '#78c9ff', border: { width: 1, color: '#78c9ff' } }
        },
        {
            column: { id: 'start' },
            row: [{ match: 'DATA' }, { id: 'summary' }],
            text: '▷',
            value: ({ data, row }) => !data[row.id] || !data[row.id].startedAt
        },
        {
            column: { id: 'restart' },
            row: [{ match: 'DATA' }, { id: 'summary' }],
            text: '⟳',
            value: () => true
        },
        {
            column: { id: 'stop' },
            row: [{ match: 'DATA' }, { id: 'summary' }],
            text: '▢',
            value: ({ data, row }) => !data[row.id] || data[row.id].startedAt
        },
        {
            column: { label: 'button' },
            row: [{ match: 'DATA' }],
            style: { textAlign: 'center', background: '#f7e540', border: { width: 1, color: '#f7bd1e' } }
        },
        {
            column: { label: 'button' },
            row: [{ id: 'summary' }],
            style: { textAlign: 'center', background: '#fcb830', border: { width: 1, color: '#c48c1b' } }
        },
        {
            column: { label: 'button' },
            row: [{ match: 'DATA' }, { id: 'summary' }],
            condition: ({ value }) => !value,
            style: { background: '#b4b4b4' }
        },
        {
            column: { label: 'time' },
            text: ({ value }) => {
                if (!value) return '';
                const timeDiff = Date.now() - value;
                let text = '';
                if (timeDiff > 86_400_000)
                    text += `${Math.floor(timeDiff / 86_400_000)}d `;
                if (timeDiff > 3_600_000)
                    text += `${Math.floor(timeDiff / 3_600_000 % 24).toString().padStart(2, '0')}h `;
                if (timeDiff > 60_000)
                    text += `${Math.floor(timeDiff / 60_000 % 60).toString().padStart(2, '0')}m `;
                text += `${Math.floor(timeDiff / 1000 % 60).toString().padStart(2, '0')}s`;
                return text;
            },
            style: { textAlign: 'right' }
        },
        {
            column: { id: 'startedAt' },
            style: ({ value }) => {
                if (!value) return {};
                const progress = Math.min(1, (Date.now() - value) / 120_000) * 0.5 + 0.5;
                return { background: `rgb(255, ${255 * progress}, ${255 * progress})` };
            }
        },
        {
            column: { id: 'isRequired' },
            text: ({ value }) => value ? '✔' : '✘',
            style: ({ value }) => ({ textAlign: 'center', foreground: value ? '#3d9943' : '#ff5454' })
        },
        {
            column: { id: 'isRequired' },
            condition: ({ value, data, row }) => value && !data[row.id].startedAt,
            style: { background: '#ffb3b3' }
        },
        {
            column: { label: 'not-filterable' },
            row: { match: 'FILTER' },
            edit: false,
            text: ''
        },
        {
            row: { id: 'summary' },
            column: { id: 'name' },
            text: ({ rows }) => `Total: ${rows.length - 3}`,
            style: { textAlign: 'right' }
        },
        {
            column: { id: 'tags' },
            text: ({ value }) => value.join(', '),
        },
        {
            column: { id: 'name' },
            row: { match: 'FILTER' },
            edit: {
                validate: ({ string }) => /^[a-z-0-9_]*$/i.test(string),
                parse: ({ string }) => ({
                    regex: new RegExp([...string].join('.*'), 'i'),
                    source: string
                })
            },
            text: ({ newValue }) => newValue?.source || '(eg. "fe-eu-1")'
        },
        {
            column: { id: 'tags' },
            row: { match: 'FILTER' },
            edit: {
                parse: ({ string }) => new Set(string.split(',').map(tag => tag.trim()))
            },
            text: ({ newValue }) => newValue ? [...newValue].join(', ') : '(eg. "fetcher, eu")'
        }
    ], []);
    const filtering = useMemo(() => [
        {
            column: { id: 'name' },
            condition: ({ text, expression }) => expression.regex.test(text)
        },
        {
            column: { id: 'tags' },
            condition: ({ value, expression }) => value.filter(tag => expression.has(tag)).length === expression.size
        }
    ], []);
    const onCellClick = useCallback(({ rowId, columnId }) => {
        switch (columnId) {
            case 'start':
                if (!data[rowId].startedAt || data[rowId].stoppedAt)
                    setData({ ...data, [rowId]: { ...data[rowId], startedAt: Date.now(), stoppedAt: null } });
                break;
            case 'restart':
                setData({ ...data, [rowId]: { ...data[rowId], startedAt: Date.now(), stoppedAt: null } });
                break;
            case 'stop':
                if (data[rowId].startedAt && !data[rowId].stoppedAt)
                    setData({ ...data, [rowId]: { ...data[rowId], stoppedAt: Date.now(), startedAt: null } });
                break;
            default:
                break;
        }
    }, [data]);
    const onCustomCellClick = useCallback(({ columnId }) => {
        switch (columnId) {
            case 'start':
                setData(Object.fromEntries(Object.keys(data).map(key => [key, data[key].startedAt ? data[key] : { ...data[key], startedAt: Date.now(), stoppedAt: null }])));
                break;
            case 'restart':
                setData(Object.fromEntries(Object.keys(data).map(key => [key, { ...data[key], startedAt: Date.now(), stoppedAt: null }])));
                break;
            case 'stop':
                setData(Object.fromEntries(Object.keys(data).map(key => [key, data[key].startedAt ? { ...data[key], stoppedAt: Date.now(), startedAt: null } : data[key]])));
                break;
            default:
        }
    }, [data]);
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(index + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [index]);

    return (
        <>
            <Example>
                <SpreadGrid
                    data={data}
                    rows={rows}
                    columns={columns}
                    formatting={formatting}
                    filtering={filtering}
                    onCellClick={onCellClick}
                    onCustomCellClick={onCustomCellClick}
                    pinnedTop={2}
                    pinnedBottom={1}
                />
            </Example>
        </>
    )
}