import React, { useEffect, useState } from "react";
import Container from "@/components/container";
import Headers from "@/components/Headers";
import useUserStore from "@/lib/AuthZustand";
import { Helmet } from "react-helmet-async";
import Loading from "@/components/Loading";
import { responseHandler } from "@/lib/utils";
import { countMasterData } from "@/Services/Buku/Buku.services";
import { FaBook, FaFileAlt, FaList, FaSchool } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    buku: 0,
    ebuku: 0,
    kategori: 0,
    unitPendidikan: 0,
  });

  const fetchCountData = async () => {
    setLoading(true);
    try {
      const response = await countMasterData();
      setData(response.data);
    } catch (error) {
      responseHandler(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountData();
  }, []);

  if (loading) return <Loading />;

  const stats = [
    { label: "Buku", value: data.buku, icon: <FaBook size={24} />, color: "bg-blue-500" },
    { label: "E-Buku", value: data.ebuku, icon: <FaFileAlt size={24} />, color: "bg-purple-500" },
    { label: "Kategori", value: data.kategori, icon: <FaList size={24} />, color: "bg-green-500" },
    { label: "Unit Pendidikan", value: data.unitPendidikan, icon: <FaSchool size={24} />, color: "bg-yellow-500" },
  ];

  return (
    <>
      <Helmet>
        <title>E-Perpus Al-Jihad Ketapang</title>
      </Helmet>
      <Headers user={user} />
      <Container>
        <h1 className="text-2xl font-bold mb-6 mt-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20 lg:pb-0 md:pb-0">
          {stats.map((item) => (
            <div
              key={item.label}
              className={`flex items-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-all ${item.color} text-white`}
            >
              <div className="p-4 bg-white bg-opacity-20 rounded-full mr-4 flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <p className="text-xl font-bold">{item.value}</p>
                <p className="text-sm">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
};

export default Dashboard;
