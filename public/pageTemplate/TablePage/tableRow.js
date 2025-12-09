import moment from 'moment';
import { Tooltip } from 'antd';

export const tableRow = [
    {
        title: '', dataIndex: 'id', key: 'id', width: 0, render: (_) => (<div style={{ display: "none" }} />)
    },
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: "6rem",
        render: (_, rowData, index) => {
            return (<div>{index + 1}</div>)
        }
    },
    {
        title: '测试列1',
        dataIndex: 'testCol1',
        key: 'testCol1',
        width: "10rem"
    },
    {
        title: '测试列2',
        dataIndex: 'testCol2',
        key: 'testCol2',
        width: "10rem",
        render: (value, record) => {
            return (
                <Tooltip title={value ?? ""}>
                    <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {value ?? ""}
                    </div>
                </Tooltip>
            )
        }
    }
]