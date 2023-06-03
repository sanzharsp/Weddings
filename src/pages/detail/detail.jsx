import { useEffect, useState } from 'react';
import axios from 'axios';
import url from '../../backend-server-url';
import { Table, Tag, Card, Input, Button, Space, Tooltip } from 'antd';
import { PlusOutlined, UndoOutlined,FileAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useParams } from "react-router-dom";
import * as XLSX from 'xlsx';


const { Search } = Input;


const columns = [
    {
      title: 'Полное имя',
      dataIndex: 'name',
    },
    {
      title: 'Я приду ',
      dataIndex: 'coming',
      render:(res)=>{
        return (
        res?
        <div style={{justifyContent:'center',textAlign:'center'}}>
        <Tag color={'green'} size={100} key={res}>
        <PlusOutlined size={100} />
        </Tag>
        </div>
        :
       <></>
        )
      },
      filters: [
        {
          text: 'Да',
          value: true,
        },
        {
          text: 'Нет',
          value: false,
        },
      ],
      onFilter: (value, record) => 
      {
       
        return record.coming === value
    }
    },
    {
      title: 'Я приду с женой',
      dataIndex: 'spouse',
      render:(res)=>{
        return (
        res?
        <div style={{justifyContent:'center',textAlign:'center'}}>
        <Tag color={'green'} size={100} key={res}>
        <PlusOutlined size={100} />
        </Tag>
        </div>
        :
       <></>
        )
      },
      filters: [
        {
          text: 'Да',
          value: true,
        },
        {
          text: 'Нет',
          value: false,
        },
      ],
      onFilter: (value, record) => 
      {
       
        return record.spouse === value
    }
    },
    {
        title: 'К сожалению, я не могу прийти',
        dataIndex: 'I_cant_come',

        render:(res)=>{
            return (
            res?
            <div style={{justifyContent:'center',textAlign:'center'}}>
            <Tag color={'green'} size={100} key={res}>
            <PlusOutlined size={100} />
            </Tag>
            </div>
            :
           <></>
            )
          },
          filters: [
            {
              text: 'Да',
              value: true,
            },
            {
              text: 'Нет',
              value: false,
            },
          ],
          onFilter: (value, record) => 
          {
           
            return record.I_cant_come === value
        }
      },
      {
        title: 'Когда оставил заяку',
        dataIndex: 'created_at',
       
        render:(res)=>{
            return (
  
            <Tag color={'pink'} size={100} key={res}>
            {res}
            </Tag>
  
            )
          },
      }
  ];
  

const Detail = () =>{ 


    let {id} = useParams();
    const [update,setUpdate] = useState(true);
    const [data,setData] = useState([]);
    useEffect(()=>{
        axios.get(`${url.BaseUrl}${url.wedding_name}/${id}`).
        then((response)=>{
            setData(response.data);
        })
    },[update]);

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
      };
    
    
      const onSearch = (value) => {
    axios.get(`${url.BaseUrl}${url.wedding_name}/search?search=${value}&WeddingName__id=${id}`).then((response)=>{
        setData(response.data);
    }
    )

      }


      const handleExportExcel = () => {
        // Создаем новую книгу Excel
        const workbook = XLSX.utils.book_new();
        const columnWidths = [
            { wch: 30 }, // Ширина столбца A (по умолчанию 8)
            { wch: 20 }, // Ширина столбца B (по умолчанию 8)
            { wch: 20 }, // Ширина столбца C (по умолчанию 8)
            { wch: 30 }, // Ширина столбца C (по умолчанию 8)
          ];
    
        // Преобразуем данные таблицы в формат, понятный для XLSX библиотеки
        const worksheetData = [
          columns.map((column) => column.title),
          ...data.map((record) =>
            columns.map((column) => record[column.dataIndex])
          ),
        ];
        // Установка ширины столбцов
        
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        worksheet['!cols'] = columnWidths;
        const boldStyle = { font: { bold: true } };

        // Применение стиля к ячейке (например, для ячейки A1)
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: 0 }); // A1
        worksheet[cellAddress].s = boldStyle;

        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = worksheet[cellAddress];
        if (cell && cell.t === 'b') { // Проверка, что тип ячейки - логический
        if (cell.v) {
            cell.v = '✔';
         } else {
            cell.v = ' ';
        }
        cell.t = 's'; // Установка типа ячейки на строковый
    }
  }
}
        // Добавляем лист в книгу
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
        // Сохраняем книгу в файл Excel
        XLSX.writeFile(workbook, 'table.xlsx');
      };
    

return(
    <>
     <Card
    title="Поиск по имени"

  >
      <Space.Compact block>
      <Tooltip title="Поиск">
    <Search
      placeholder="Введите имя приглашенного"
      allowClear
      enterButton={<><SearchOutlined /> Искать</>}
      size="large"
      onSearch={onSearch}
    />
    </Tooltip>
      <Tooltip title="Вернуть данные">
      <Button type='primary' onClick={()=>{setUpdate(!update)}}><UndoOutlined />Вернуть данные</Button>
      </Tooltip>
 
      <Tooltip title="Преоброзовать в exel">
      <Button type='primary' onClick={handleExportExcel}> <FileAddOutlined />Exel</Button>
      </Tooltip>
 
      </Space.Compact>
  </Card>

<Table columns={columns} dataSource={data} onChange={onChange} />
</>
)
}
export default Detail;

