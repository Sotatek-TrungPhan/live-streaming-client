import { Button, Flex, Form, Input, Spin } from "antd";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState, useCallback } from "react";
import { axiosInstance } from "../services/config";
import { useNavigate } from "react-router-dom";
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
  
  const getProfile = useCallback(async () => {
    if (!user?.userId || !accessToken) {
      throw new Error("User ID or access token is missing");
    }
    const res = await axiosInstance.get(`member/${user.userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  }, [user?.userId, accessToken]);

  useEffect(() => {
    let isMounted = true;

    const checkRegistration = async () => {
      if (!user?.userId || !accessToken) {
        return;
      }

      try {
        const res = await getProfile();
        if (res.isRegistered && isMounted) {
          navigate(`/information`);
          return; // Early return to avoid further processing
        }
      } catch (error) {
        console.error("Failed to get profile", error);
      } finally {
        if (isMounted) {
          setLoading(false); // Only set loading to false once
        }
      }
    };

    checkRegistration();

    return () => {
      isMounted = false;
    };
  }, [user?.userId, accessToken, getProfile, navigate]);

  const onFinish = async (values: any) => {
    if (!user?.userId || !accessToken) {
      console.error("User ID or access token is missing");
      return;
    }
    try {
      await axiosInstance.patch(
        `member/${user.userId}`,
        { ...values },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      navigate(`/information`);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}>
        <Flex align="center" gap="middle">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </Flex>
      </div>
    );
  }

  return (
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
