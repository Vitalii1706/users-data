import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Form, InputNumber, Popconfirm, Table, Typography } from "antd";
import { useState, useEffect } from "react";
import getData from "./getway";
import Select from "react-select";

const options = [
  { value: "all", label: "all" },
  { value: "male", label: "male" },
  { value: "female", label: "female" },
];

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : null;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Users = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  console.log(data);
  const [editingKey, setEditingKey] = useState("");
  const filterMaleData = data.filter((obj) => obj.gender === "male");  
  const filterFemaleData = data.filter((obj) => obj.gender === "female");
   

  const handleChange = ({ value }) => {
    
    if(value === 'all') {
      setData()
    }
  };

  const isEditing = (record) => record.key === editingKey;

  const fetchData = () => {
    getData().then((arr) => setData(arr));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      email: "",
      gender: "",
      status: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      width: "20%",
      editable: true,
    },
    {
      title: "email",
      dataIndex: "email",
      width: "15%",
      editable: true,
    },
    {
      title: "gender",
      dataIndex: "gender",
      width: "25%",
      editable: true,
    },
    {
      title: "status",
      dataIndex: "status",
      width: "25%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "email" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Select options={options} onChange={handleChange} />
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default Users;
