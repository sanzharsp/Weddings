import { useEffect, useState } from 'react';
import axios from 'axios';
import url from '../../backend-server-url';
import { Button, Table, Tag } from 'antd';
import {Link} from "react-router-dom";
const columns = [
    {
      title: 'Чей праздник',
      dataIndex: 'name',
    },
    {
      title: 'Дата записи в базу данных',
      dataIndex: 'created_at',
      render: (res) => (
        <>
        
              <Tag color={'green'} key={res}>
                {res.toUpperCase()}
              </Tag>
          
    
        </>
    )
    },
    {
      title: 'Дата праздника ',
      dataIndex: 'WeddingDate',
      render: (res) => (
          <>
          
                <Tag color={'red'} key={res}>
                  {res.toUpperCase()}
                </Tag>
            
      
          </>
      )
    },
    {
      title: 'Описание',
      dataIndex: 'description',
    },
    {
        title: 'Подробнее',
        dataIndex: 'id',
        render: (id)=> <Link  to={`/post/${id}`} className="read-more"><Button  type="primary" size={14} >Смотреть</Button></Link>
      },
  ];

const Main = () => {
    const [data, setData] = useState([]);
    useEffect(()=>{
        axios.get(url.BaseUrl+url.wedding_name).then((response)=>{
            setData(response.data)
        })
    },[]);



  
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
  return <Table rowSelection={rowSelection} columns={columns} dataSource={data} />;
};
export default Main;