import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { axiosInstance } from "../services/config";
import { useNavigate } from "react-router-dom";
import { Flex, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export const Information = () => {
  const { accessToken, user } = useAuth();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getProfile = useCallback(async () => {
    if (!accessToken || !user?.userId) {
      console.error("Access token or user ID is missing");
      return;
    }
    try {
      const res = await axiosInstance.get(`/member/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserInfo(res.data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  }, [accessToken, user?.userId]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (accessToken && user?.userId) {
        await getProfile();
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [accessToken, user?.userId, getProfile]);

  useEffect(() => {
    if (userInfo && !userInfo.isRegistered) {
      navigate('/register');
    }
  }, [userInfo, navigate]);

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

  if (!userInfo) {
    return <div>No user information available.</div>;
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    }}>
      <h1>Information</h1>
      <p>User: {userInfo.firstName} {userInfo.lastName}</p>
      <p>Email: {userInfo.email}</p>
      <p>Telephone: {userInfo.telephone}</p>
      <p>Address: {userInfo.address}</p>
    </div>
  );
};
