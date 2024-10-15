import { Button, Flex, Form, Input, Spin } from "antd";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { axiosInstance } from "../services/config";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
  },
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const Register = () => {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { liffId } = useParams();

  const getProfile = async (accessToken: string) => {
    const res = await axiosInstance.get(/member/${user?.userId}, {
      headers: {
        Authorization: Bearer ${accessToken},
      },
    });
    return res.data;
  };

  useEffect(() => {
    (async () => {
      if (accessToken) {
        const res: any = await getProfile(accessToken).finally(() => setLoading(false));
        if (res.isRegistered) {
          navigate(/information/${liffId});
        }
      }
    })();
  }, [accessToken]);

  const onFinish = async (values: any) => {
    try {
      await axiosInstance.patch(
        /member/${user?.userId},
        { ...values },
        {
          headers: {
            Authorization: Bearer ${accessToken},
          },
        }
      );
      navigate(/information/${liffId});
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return loading ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Flex align="center" gap="middle">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Flex>
    </div>
  ) : (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      validateMessages={validateMessages}
    >
      <Form.Item
        name={["firstName"]}
        label="First name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["lastName"]}
        label="Last name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["email"]}
        label="Email"
        rules={[{ type: "email", required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};