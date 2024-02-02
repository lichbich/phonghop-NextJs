import React, { useState } from "react";
import { Modal, Image, Row, Col } from "antd";
// import Button from "@/constants/Form/Button";
import styles from "/src/css/AddUser.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import customstyle from "@/css/CompanyList.module.css";
import Button from "@/constants/Form/Button";
import { createEntityAdapter } from "@reduxjs/toolkit";
import "@/css/BookingSuccess.css";
import moment from "moment";

const BookingSuccess = ({openModal, closeModal,result}:any) => {
  const [visible, setVisible] = useState(false);
  const user = useSelector((state: any) => state.user.value);
  const [openModal1, setOpenModal] = useState(true);
  const usertype = user.type;
  
  const showPopup = () => {
    openModal(true);
  };
  const handleCancel = () => {
    openModal(false);
    // setVisible(false);
  };

  return (
    <>
      {/* <button key="add" className={customstyle.addbtn} onClick={showPopup}>
        Booking Success
      </button> */}
      <Modal
        title={
          <div className={styles.formTitle}>
            {/* <Image src="@/public/assets/logo_full.svg" /> */}
            <Image
              preview={false}
              src={
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAAtCAYAAAB/G08YAAAAAXNSR0IArs4c6QAAEONJREFUeF7tXHt8FPW1P2d3s5kl4S2PQEVUEAUUjRGVthYt8pzfrCABa6te6y0fUbzeaxVBxEYQsO1FvVe5IFofeL1XiYDMbxIULEJVENtQESxSQZT3Q1EJJLvJzpzOWWbibLKPAAGCzfknn2TO73W+8/v9zvmeM0HIIJqmFRDR20R0p2EY89KpDx06tKPf7/8IAJ6QUk7P1LcQ4nMAKJFS3plJt+l5/SyAmdQ0TbuFiF4AgP+WUt6dTl/TtKuIaCUA/E1K2SudrqqqnRFxBwBEpJShTPNoel4/CyQAevmMWQPR8g1GpF6EeJi7CO3c0iX3i02XRtvmbTnY4xLefSkl+NWeM1puWvvj6hat93zT+8rV6XT9FYdCbT7802ArqJR/VXDNW15dBAxalvWRz0/G6gl3rqrfUpq02AJxQPvNmHWZRb7nAKB3bbMo+3dC883roLJjVzh0ds+0Vss6eABaffw+VLVuD9+eX5BW11cVgbZly8EM5cKBi69Ko0tvW6Z52weT79raBFlmCyAUFfmuCHb4LKhkn9XuzM7QumM7yG4WAsu04q0rPloLBxbPh9y+/aDVIC1tj9FtW2H/i0+Dct4FcMboW9LqmuUHYfcT0yGrXXvocPs9Nbr+gB8sy4JoRSUc2LUX9m3bCbFYbPWaB8b2y7ycJg28Yvqce9p36TSzS8/zklrj8Id/gS8XvQrNL/8RtBkaTmuxyBefwd7nZkOoR09of+Ot6QE9+C3smPkIZLXrAJ3G3ZtS1zJN2Lp+IxzYu3/kmoljFzRBlt4C+NOn5m27oF/fM1OpnWpAeV5mdQzWr1g1/937x4xuAjQDoIULllKHs7uk1NrxxhIwVy8HOrcndL05/a7bs2YNREtfA6tDZ+h6+92AvtRO9IEtW6F83v/Ex82bMBWCISXtTPdt/vzQ/FGDmzc0oIWFhf5IJDIPET/TdX1yQ/d/svvDMavWUVDJTjpuZflh2PL6oiNOUYcu0O66UdC2U4ekumbMhA0LXz/iFLVqB7naKMg7t2vK9WxYuhyav7cEzFAO+NQboGvv89PfzwcPWc/0L/A3tIGGDBnSLhAI7AOAr6SUZzR0/ye7Pxy39hNKN+jG1WUA6/8MlXldofeA/ml30pa/boBo2WqoatMeul3dH3Jbt0zZ9baNn0L5mvfAVHLgBz+5CtrkJX9R3A5ikSjM6dcnY9x8tAbUNK0DEe0BgG+klK2Ptn1j088IKO+8vZ9vhzYd24OS2yzj/Fk3p2WLtGC6nezfvgv4dGjZrm3GfmPRKppz5UW+jIpHqfBPB+hR2ueEqTcBWj/TZtyh9evmxGvVB1DnPvwYEX8LAHOJ6H77KP13AGCP62MAWBAIBGYtWrToK3fGnjv0gJSyraqqP0fEnxFRPiKyc/Enh5tmSrOOhMPhfpZljQWAKwDgBwCwFRFXEtFTUkoeM0GEEO8AwF4p5UhN0wqJ6GYAuAQA+Ph7FxGf1HV9WbKxNE0bTERTbP77Muf5LiKaWlBQMLesrOxvAHD4ewWos+AlzCUDQBAAuiUxzJcAIKSU7/MzL6BE9Dwi/hoAqhBxPRH1AIBc/h0A+kgpP/H2p2naOCJ60vnbJgDgu5g9wbMAoBIRR+i6/obbZuDAgTnZ2dmH+Jnd73/aERl71e5YTASwF28i4mW6rv/VO5YQ4g4AmOX8jefB6+AXIQcAJK+Jn502gLYK+GOPXNQ9K91Z4AGU1fYg4oT8/PyXVq1aFVIU5VIimgYAPwKAbYqi9CouLj7kATTeNRHNCIVC0/lZYWFhMBKJPAsANxHRK4Zh/Mwd39ld8xkcIrrbMAzWozFjxmTt3r17om3bhznxAABXSSn/zO0KCwtzI5FIuWcNjyuK8nBxcfG33G7Pnj2ziOhXDJCUsoaWGzZs2CCfz8cvxiFEHKvr+ss8FodcFRUVA3w+3xznRQLce6gyrZd74g/T+o1AANs75oZSB8wA4AKKiH/Pzs7uy4by9u7EnPzmX0hE4wzDmOUFlIjGGIbxjLfNiBEj8qqrq3exMaWUNXGwEGIdAFwEALdKKTkblSCapk0logdtnYVSyuuTAHqPlPJxb6MhQ4a0CAQCPOcqKSVfE3FshBCc6LgCEW/Sdf1/a4913XXXnWua5ub4Dj1YGT0tALUN90WLUHbqwNYDKAD8UUo5IMU9dIN9lP4/ACyTUg4cPnx4+1gsthcAvpZStknSBoUQ1QDgVxSlWXFxcaWT993NoU55eXm7FStWxGq3GzRoUJtgMMh3daWUMh4eeHZo1AGsznBCiIPO0dtOSvllYWFhy0gk8g0AlOfl5bWdO3cuzyVBnJMk+r0DVAgxBABK7WNuuZTyp8kAVVW1DyJ+CACbpZTd6xO2CCHYWEFEbKHrerkQgp2SDwBgnZTy4lRnjAuOZVltSkpKvtY0rTkRMWC8A5OyOUKIAwDQ2jTNvNLS0j3hcPhCTiUCwEYpZdJ0l3PM8z2feYdWv7MMqLrOSwHBa4YmrKNqOduxriTomTGoWrm0jlLgggvBl5eSTnb1M+7Q+gCqadpFRLSOiLYYhtHtWAB1qjj4XtwgpbwwDaAVnFKuqqpq++abbx44FkBVVe3OVwgA7JRSshddR4YMGZIdCAT4vq4foJFXn0/oxN+1GzS7l73n76Ry1qMQ25iY/87WboDgQE/KzYxB+d3spSdKzqTfNgigHqco5ZGrqupoRHyFiN4yDOPaYwTUZZcqFUVpzw5U7TUJIZjL3Oi9e48F0MLCwlAkEuF7lR3Cc6SUdfLCR71DT0NAdyFivq7rfDfWiNcpQsQ7dF2ffSyAcodCiHfte/iHHH5IKe+rBSjfu4sAIExEzxmGcRs/PxZAnbE4bTiCvV9FUYYXFxeb3vE0TRtLRPFMR0aniI/c0wXQcDg82rKsV5zFckw40zTNt3JycjZHo9F8T9iyXVGUnryzjhVQVVWvRMR4eQyHNHbs+XwgEPjANM3+toPFtVf885Bpmr1LS0u/OB5ANU3rQUR8xLOXLYmIwxQ+zvle52TytS7A3ytAhRAP2EfTNCLajUdqopISCz6fT128ePEa5+3nDMv+dNkWIQQTAUo0Gs1dunRpvNaKxWGV2LhMPtQWjoNv1HX9bfeBh1hIWRgnhGDCoG0gEOiwaNEizgK5Y/VFxDdt1qpVrYE4SuHwiGPs+u3Q6veZ/fIIYtI7lCpq1hpXDvS5rM4dWvEYx9uJovxiTM0dWlFRAXNnz4KrrxkAfS5hIqRG6uMUTbKHfYQ9WD5yieguABgEAFzgxHFaHeqvqKjIt3bt2nlE9LmUkg1TR4QQHC/mSik56E8Q5xgd5aX+uPLRNM3XlyxZEg8lvCKE4NotTtXVPqZd4Kb7fL7O+fn5txYVFR2pA3KEX4hgMHgNIg6wKzG7+ny+92y2aHF2dva2SCTCO/Zwxh2abIEn6m+RSASmTymCXTt3wkNTHoEuZzGDVn9AVVV9EBGncsxqB/tpY9YTtYZT0W84HO5pWRbzxpsaDaBV0ShMm1IEO7Zvh8kPT4GuZ59T2zYZd6gH0JQu/qkw+IkeU1XV3yBikZ0ceDYjoObmBD66Zm7+bokVBvXVS7Y4BvPRaVNh69atMOmhIujWvXsytYyAuncoZzMURekciUQmOA7DpQCwHQBWIeKk2t6vdzAOAXbs2NELEWOWZX2a7Nh09YcNG/bjkpISzp4wC+SvrKy80u/3V1uWtV5KyUdgg8jQoUPP8/v9fFczIWLEYrH33HmpqjocEV9ikp6ILs4IaEN5uc/MmQ2hUAh+ccu/JCyyuroaZkx9OA7mhEmTocf5KUtRjgbQr+0oYS0AMFvEtBnHbkwABJwgvYAZH+9EnAB+BkcXTszHj5l9ed00zfGup+q20TRtBBEtQMTbLMvab7NIj3mcMA4rFhLRJMMwPj1eVFVV7WuXTy9FxJQlIIg4S9f1cScN0OVvLYM/zH0ahl8/EkaOviG+Rgbz9zOmw983fQITJ/8mHZisXh9Ab7KDb/f7mygT8AUFBc+xc+GEJ38EgF5ENNEwjEc94FxCRMsdD5LB5zeehfs720lV9ffmN1VVnWDnS2cw42TvkHPZIbEd3784ffBnIAEAiFqWda27i48H2OHDh7c1TfMuIuJ4lPt3qzc+RcSndV3nF4pOGqC8mDdKDHjpxRdg9I0/h6GqgN9NnwabPtkI4x+YBL16p2TQXDtkBFTTtGuJiLnFpIbUNO2XRPQHRFyk6zobBvr37680b958i50Q78Tf7yiKcl9xcXGcF3VIb85B/isf2Yqi9GBynp+5gDqTe9am3ia4iXM2fiwWm81dOO26uX0eD6j1aXtSAeUJLXytGBbMfxU6de4M+/buhXvG3w99Lk4IT1LN+2gAXSql5HAlQcLh8ADLsrgaYKWUkgN/BiZOBTLZLqW8PMngzPrwzuMKhlG6rhezjqZpE4mIv7CbLaXk5HOCOHQcc6F8h9wopeQMzwmX+gFa/GLCRPxdzknO5W7akKCXrY5KjEOdp3NmPQnvrFwJvx5/P+QXuNUUGdeaEVA3EezytLV7VFW1PyK+jYjv6Loe/6BGCPFfAPBvAFAnP+m2V1X1PkT8nVOK8h9Ou3jMS0QzDcNIWvrvgo6Iz+i6PibjChtAISOgDTBGQ3VxogDl3ckV+Sl3kRAifjd7qxZcsNIBqqrqSETkHc3fwKpeQ7CH7PP5Jkop42krJ7nNKbLOQojXELGMfQDnKliSl5cXTpYLrW3cJkCPMDe3JqtWcI3l1g55iXY76Z1xh6qq+itEnAsA86WUCZ9xCCE46b0PEc+zd+8uTdPGENEgrm4QQqwgom+zsrJ+GQgEyiORCIP7gGEYXDuUVhoO0Oq4H1FXsrhWyxEzBmAlsFnfPfPqJe/pRO3QOP8LAK/aRWBH3O9aoqrqYkTkcGaC/XEyVxTyUe3yximPXCEEl7OwQzVVSvlQkn6fRMTd/LW7nctlbpl37HIGFBGnudV/QgjOX74vpXz6pAHaGPKhx3KHhsPhMy3LYi83CxHDuq7rXqN5js2qrKysrgsXLuTSE69TtNPmbq+uHW9y7IiIXAvkM02zR2lpKSepE0TTtG5EtAwRB1uWVcIJd+dlWWFZ1oySkhIm4/nleZ6I1hiGweRCWmmwHdoYAHW9WM5K6Lo+uPbKhRA/sSOVFV4v17vb7KxFjIi4tDJe4omI/E0qZ/L5m5qa3cnPaoUtfDwxycBAMMnADhf/3whOSid4wVyU5vf7r3fBEUJwbByyj97/03X9qSZAPag58R8TC69IKV1yoEbDKdx60YlD+e50hUMTjje5YLqOOI4PZ0dqCuo8YQuPw4F+fpKmLyiKcocbuzpg8UvFd2r8Yx6nyuL3sVjsh0uWLOF6I96Rz1qWNbukpKTM+Z1fKg6rjH+qHZppsZmeDxs2rLddYM0llxxz8m79iIjml5SUcClJgniYopkFBQXjy8rKhtoV81dzcTa3Q8SXk1XOZ5rD8T4/bY5cBNzbPBTseLwLbqj2rpcLAI9LKb/7nwINNcAx9oPlldEdBND5GNvXNDO3J/+fFv4zmQp1xIyBuYuTHomCgUA9isRwVYtQkGt4GoU0XkAjVU9wKX+jsFK6SRDd26KZMrOxzLPRAnowGj0frHi5YaMVRIjmZgfPsAui6pRLnqpJe+/QVNTfqZhb/Ivog5Hq+4As5iobpRDgzS1DwTpe66mcrKZpnHJ7zHaeHtR1nWt7GoXUfOJeHo1eAIS3E9FIhz88pRMkoG0I+LLfij2Vk5PDHws1ST0s8A9PZJeUoBwTzwAAAABJRU5ErkJggg=="
              }
              alt="This is ảnh"
            />
          </div>
        }
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        width={765}
        centered
      >
        <Row justify="center" gutter={[0, 24]} className="bookingSuccess">
          <h2>You have successfully booked a meeting room!</h2>
          {usertype === 1 && (
            <Col span={19}>
              <p>
                Here is your booking summary, kindly check your mail box for
                confirmation letter. For urgent situation, kindly reach via
                telephone number: +84 987 460 988
              </p>
            </Col>
          )}
          {usertype === 3 && (
            <Col span={20}>
              <p>
                Here is your booking summary. Please note that your booking is
                still in queue for confirmation and maybe overlap by others. To
                avoid overlapping in future, kindly create an an account and
                Sign In. For urgent situation, kindly reach us at: +84 987 460
                988
              </p>
            </Col>
          )}

          {/* <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}> */}
          <Row justify="center" gutter={[0, 8]}>
            {/* =======================1=========================== */}
            <Col span={24}>
              <Row justify={"center"}>
                <Col span={1} offset={3}>
                  <svg
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM10 3V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3H12.5C12.7761 3 13 3.22386 13 3.5V5H2V3.5C2 3.22386 2.22386 3 2.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10ZM2 6V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H2ZM7 7.5C7 7.22386 7.22386 7 7.5 7C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8C7.22386 8 7 7.77614 7 7.5ZM9.5 7C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7ZM11 7.5C11 7.22386 11.2239 7 11.5 7C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8C11.2239 8 11 7.77614 11 7.5ZM11.5 9C11.2239 9 11 9.22386 11 9.5C11 9.77614 11.2239 10 11.5 10C11.7761 10 12 9.77614 12 9.5C12 9.22386 11.7761 9 11.5 9ZM9 9.5C9 9.22386 9.22386 9 9.5 9C9.77614 9 10 9.22386 10 9.5C10 9.77614 9.77614 10 9.5 10C9.22386 10 9 9.77614 9 9.5ZM7.5 9C7.22386 9 7 9.22386 7 9.5C7 9.77614 7.22386 10 7.5 10C7.77614 10 8 9.77614 8 9.5C8 9.22386 7.77614 9 7.5 9ZM5 9.5C5 9.22386 5.22386 9 5.5 9C5.77614 9 6 9.22386 6 9.5C6 9.77614 5.77614 10 5.5 10C5.22386 10 5 9.77614 5 9.5ZM3.5 9C3.22386 9 3 9.22386 3 9.5C3 9.77614 3.22386 10 3.5 10C3.77614 10 4 9.77614 4 9.5C4 9.22386 3.77614 9 3.5 9ZM3 11.5C3 11.2239 3.22386 11 3.5 11C3.77614 11 4 11.2239 4 11.5C4 11.7761 3.77614 12 3.5 12C3.22386 12 3 11.7761 3 11.5ZM5.5 11C5.22386 11 5 11.2239 5 11.5C5 11.7761 5.22386 12 5.5 12C5.77614 12 6 11.7761 6 11.5C6 11.2239 5.77614 11 5.5 11ZM7 11.5C7 11.2239 7.22386 11 7.5 11C7.77614 11 8 11.2239 8 11.5C8 11.7761 7.77614 12 7.5 12C7.22386 12 7 11.7761 7 11.5ZM9.5 11C9.22386 11 9 11.2239 9 11.5C9 11.7761 9.22386 12 9.5 12C9.77614 12 10 11.7761 10 11.5C10 11.2239 9.77614 11 9.5 11Z"
                        fill="#323232"
                      ></path>{" "}
                    </g>
                  </svg>
                </Col>
                <Col span={10} className="booking-infor">
                  <strong>Date: &nbsp;</strong> {moment(result.data.from_time).format('DD MMMM YYYY')};
                </Col>
              </Row>
            </Col>
            {/* ========================2========================== */}
            <Col span={24}>
              <Row justify={"center"}>
                <Col span={1} offset={3}>
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.50009 0.877014C3.84241 0.877014 0.877258 3.84216 0.877258 7.49984C0.877258 11.1575 3.8424 14.1227 7.50009 14.1227C11.1578 14.1227 14.1229 11.1575 14.1229 7.49984C14.1229 3.84216 11.1577 0.877014 7.50009 0.877014ZM1.82726 7.49984C1.82726 4.36683 4.36708 1.82701 7.50009 1.82701C10.6331 1.82701 13.1729 4.36683 13.1729 7.49984C13.1729 10.6328 10.6331 13.1727 7.50009 13.1727C4.36708 13.1727 1.82726 10.6328 1.82726 7.49984ZM8 4.50001C8 4.22387 7.77614 4.00001 7.5 4.00001C7.22386 4.00001 7 4.22387 7 4.50001V7.50001C7 7.63262 7.05268 7.7598 7.14645 7.85357L9.14645 9.85357C9.34171 10.0488 9.65829 10.0488 9.85355 9.85357C10.0488 9.65831 10.0488 9.34172 9.85355 9.14646L8 7.29291V4.50001Z"
                        fill="#323232"
                      ></path>{" "}
                    </g>
                  </svg>
                </Col>
                <Col span={10} className="booking-infor">
                  <strong>Time: &nbsp;</strong> From {moment(result.data.from_time).format('HH:mm A')} to {moment(result.data.to_time).format('HH:mm A')};
                </Col>
              </Row>
            </Col>
            {/* =======================3=========================== */}
            <Col span={24}>
              <Row justify={"center"}>
                <Col span={1} offset={3}>
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#323232"
                    stroke="#323232"
                    stroke-width="0.01024"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        fill="#323232"
                        d="M800 416a288 288 0 1 0-576 0c0 118.144 94.528 272.128 288 456.576C705.472 688.128 800 534.144 800 416zM512 960C277.312 746.688 160 565.312 160 416a352 352 0 0 1 704 0c0 149.312-117.312 330.688-352 544z"
                      ></path>
                      <path
                        fill="#323232"
                        d="M512 512a96 96 0 1 0 0-192 96 96 0 0 0 0 192zm0 64a160 160 0 1 1 0-320 160 160 0 0 1 0 320z"
                      ></path>
                    </g>
                  </svg>
                </Col>
                <Col span={10} className="booking-infor">
                  <strong>Location: &nbsp;</strong> {result.data.meeting_room.location}
                </Col>
              </Row>
            </Col>
            {/* ======================4============================ */}
            <Col span={24}>
              <Row justify={"center"}>
                <Col span={1} offset={3}>
                  <svg
                    width={24}
                    height={24}
                    fill="#323232"
                    viewBox="0 0 32 32"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <title>door-open</title>{" "}
                      <path d="M30 29.25h-1.25v-25.25c-0-0.414-0.336-0.75-0.75-0.75h-6c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h5.25v25.25c0 0.414 0.336 0.75 0.75 0.75h2c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0zM17.853 1.26l-11.977 2c-0.357 0.062-0.626 0.37-0.626 0.74 0 0 0 0 0 0v0 25.25h-3.25c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h15.977c0.414-0 0.75-0.336 0.75-0.75v0-28c-0.001-0.414-0.337-0.75-0.751-0.75-0.043 0-0.086 0.004-0.127 0.011l0.004-0.001zM6.75 29.25v-24.615l10.477-1.749v26.364zM13.979 15.3c-0.082-0.030-0.177-0.048-0.276-0.048-0.21 0-0.401 0.079-0.545 0.209l0.001-0.001c-0.136 0.139-0.22 0.33-0.22 0.54s0.084 0.401 0.22 0.54l-0-0c0.145 0.122 0.334 0.197 0.539 0.199h0.001c0.1-0.002 0.197-0.016 0.288-0.042l-0.008 0.002c0.094-0.039 0.173-0.092 0.24-0.159v0c0.136-0.139 0.22-0.33 0.22-0.54s-0.084-0.401-0.22-0.54l0 0c-0.067-0.068-0.147-0.122-0.236-0.158l-0.005-0.002z"></path>{" "}
                    </g>
                  </svg>
                </Col>
                <Col span={10} className="booking-infor">
                  <strong>Meeting Room: &nbsp;</strong> {result.data.meeting_room.name}
                </Col>
              </Row>
            </Col>
            {/* ================================================== */}
          </Row>
          {/* </div> */}
          <Row justify={"center"}>
            <Col span={24}>
              <Button
                className={styles.buttonClose}
                onClick={handleCancel}
                label="COMPLETE"
              />
            </Col>
          </Row>
        </Row>
      </Modal>
    </>
  );
};

export default BookingSuccess;
