"use client";

import { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import {
  App,
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Tabs,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  BOOST_HOURS,
  BOOST_PRICE,
  CATEGORIES,
  COVER_OPTIONS,
  NEIGHBORHOODS,
} from "@/lib/seed";
import { won } from "@/lib/format";
import { useCrewlog } from "@/lib/store";
import type { CategoryId, NeighborhoodId } from "@/lib/types";

const { TextArea } = Input;

interface MeetupFormValues {
  title: string;
  categoryId: CategoryId;
  neighborhoodId: NeighborhoodId;
  startsAt: dayjs.Dayjs;
  place: string;
  capacity: number;
  description: string;
  boost: boolean;
}

interface PostFormValues {
  title: string;
  body: string;
  categoryId: CategoryId;
  neighborhoodId: NeighborhoodId;
  image?: string;
  meetupId?: string;
}

function CoverPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string | undefined) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {COVER_OPTIONS.map((option) => {
        const selected = value === option.src;
        return (
          <button
            key={option.src}
            type="button"
            onClick={() => onChange?.(selected ? undefined : option.src)}
            className="group relative overflow-hidden border transition-all"
            style={{
              borderColor: selected ? "#141413" : "#E5E0D8",
              outline: selected ? "2px solid #141413" : "none",
              outlineOffset: 1,
            }}
            title={option.label}
          >
            <span className="relative block aspect-square">
              <Image
                src={option.src}
                alt={option.label}
                fill
                sizes="120px"
                className="object-cover"
              />
            </span>
            <span className="absolute inset-x-0 bottom-0 bg-[#141413]/70 px-1 py-0.5 text-[9px] text-[#FAF8F5]">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function Composer() {
  const {
    composerOpen,
    composerTab,
    setComposerTab,
    closeComposer,
    createMeetup,
    createPost,
    openDetail,
    neighborhood,
    meetups,
  } = useCrewlog();
  const { message } = App.useApp();

  const [meetupForm] = Form.useForm<MeetupFormValues>();
  const [postForm] = Form.useForm<PostFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const defaultNeighborhood: NeighborhoodId =
    neighborhood === "all" ? "seongsu" : neighborhood;

  const handleMeetup = async () => {
    const values = await meetupForm.validateFields();
    setSubmitting(true);
    const id = createMeetup({
      title: values.title.trim(),
      categoryId: values.categoryId,
      neighborhoodId: values.neighborhoodId,
      startsAt: values.startsAt.toISOString(),
      place: values.place.trim(),
      capacity: values.capacity,
      description: values.description.trim(),
      boost: values.boost,
    });
    setSubmitting(false);
    message.success(
      values.boost
        ? "번개를 열었습니다. 부스트가 24시간 노출됩니다."
        : "번개를 열었습니다. 동네 지도에 핀이 세워졌어요.",
    );
    meetupForm.resetFields();
    closeComposer();
    setTimeout(() => openDetail(id), 260);
  };

  const handlePost = async () => {
    const values = await postForm.validateFields();
    setSubmitting(true);
    createPost({
      title: values.title.trim(),
      body: values.body.trim(),
      categoryId: values.categoryId,
      neighborhoodId: values.neighborhoodId,
      image: values.image,
      meetupId: values.meetupId,
    });
    setSubmitting(false);
    message.success("인증샷을 피드 맨 위에 올렸습니다.");
    postForm.resetFields();
    closeComposer();
    setTimeout(() => {
      document.getElementById("feed")?.scrollIntoView({ behavior: "smooth" });
    }, 260);
  };

  return (
    <Drawer
      open={composerOpen}
      onClose={closeComposer}
      width={560}
      title={
        <div>
          <p className="eyebrow">NEW POST</p>
          <p
            className="mt-1 text-[19px] tracking-[-0.03em] text-[#141413]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            무엇을 남길까요
          </p>
        </div>
      }
      styles={{ body: { paddingTop: 8 } }}
    >
      <Tabs
        activeKey={composerTab}
        onChange={(key) => setComposerTab(key as "meetup" | "post")}
        items={[
          {
            key: "meetup",
            label: "번개 열기",
            children: (
              <Form<MeetupFormValues>
                form={meetupForm}
                layout="vertical"
                requiredMark={false}
                initialValues={{
                  categoryId: "running",
                  neighborhoodId: defaultNeighborhood,
                  capacity: 8,
                  startsAt: dayjs().add(2, "hour").startOf("hour"),
                  boost: false,
                }}
                onFinish={handleMeetup}
              >
                <Form.Item
                  name="title"
                  label="번개 이름"
                  rules={[{ required: true, message: "번개 이름을 적어주세요." }]}
                >
                  <Input placeholder="예) 퇴근 후 한강 6K, 말 없이 뛰어요" maxLength={40} showCount />
                </Form.Item>

                <div className="grid grid-cols-2 gap-3">
                  <Form.Item name="categoryId" label="종류" rules={[{ required: true }]}>
                    <Select
                      options={CATEGORIES.map((item) => ({
                        value: item.id,
                        label: item.label,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item name="neighborhoodId" label="동네" rules={[{ required: true }]}>
                    <Select
                      options={NEIGHBORHOODS.map((item) => ({
                        value: item.id,
                        label: item.label,
                      }))}
                    />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Form.Item
                    name="startsAt"
                    label="언제"
                    rules={[{ required: true, message: "시간을 골라주세요." }]}
                  >
                    <DatePicker
                      showTime={{ format: "HH:mm" }}
                      format="MM.DD ddd HH:mm"
                      style={{ width: "100%" }}
                      placeholder="날짜와 시간"
                    />
                  </Form.Item>
                  <Form.Item name="capacity" label="정원" rules={[{ required: true }]}>
                    <InputNumber min={2} max={40} style={{ width: "100%" }} addonAfter="명" />
                  </Form.Item>
                </div>

                <Form.Item
                  name="place"
                  label="만나는 곳"
                  rules={[{ required: true, message: "만날 장소를 적어주세요." }]}
                >
                  <Input placeholder="예) 잠실한강공원 2번 출구 앞" maxLength={40} />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="어떤 번개인가요"
                  rules={[{ required: true, message: "한두 줄 소개를 적어주세요." }]}
                >
                  <TextArea
                    rows={4}
                    maxLength={300}
                    showCount
                    placeholder="페이스, 준비물, 끝나고 할 일까지 적어두면 참여가 빨라집니다."
                  />
                </Form.Item>

                <div className="mb-4 border border-[#E5E0D8] bg-white px-3.5 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[12.5px] font-medium text-[#141413]">
                        상단 부스트
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#6B6660]">
                        {won(BOOST_PRICE)} · {BOOST_HOURS}시간 동안 피드와 지도 상단에
                        노출됩니다. 결제는 데모입니다.
                      </p>
                    </div>
                    <Form.Item name="boost" valuePropName="checked" noStyle>
                      <Switch />
                    </Form.Item>
                  </div>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={submitting}
                  icon={<PlusOutlined />}
                >
                  번개 열기
                </Button>
                <p className="mt-3 text-[10.5px] leading-relaxed text-[#A8A096]">
                  데모 앱입니다. 입력한 내용은 서버로 전송되지 않고 이 브라우저 세션에만
                  반영됩니다.
                </p>
              </Form>
            ),
          },
          {
            key: "post",
            label: "인증샷 올리기",
            children: (
              <Form<PostFormValues>
                form={postForm}
                layout="vertical"
                requiredMark={false}
                initialValues={{ categoryId: "photowalk", neighborhoodId: defaultNeighborhood }}
                onFinish={handlePost}
              >
                <Form.Item
                  name="title"
                  label="한 줄 제목"
                  rules={[{ required: true, message: "제목을 적어주세요." }]}
                >
                  <Input placeholder="예) 붉은 벽돌 사이로 오후 네 시" maxLength={40} showCount />
                </Form.Item>

                <div className="grid grid-cols-2 gap-3">
                  <Form.Item name="categoryId" label="종류" rules={[{ required: true }]}>
                    <Select
                      options={CATEGORIES.map((item) => ({
                        value: item.id,
                        label: item.label,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item name="neighborhoodId" label="동네" rules={[{ required: true }]}>
                    <Select
                      options={NEIGHBORHOODS.map((item) => ({
                        value: item.id,
                        label: item.label,
                      }))}
                    />
                  </Form.Item>
                </div>

                <Form.Item name="image" label="사진" extra="샘플 사진 중에서 고를 수 있습니다.">
                  <CoverPicker />
                </Form.Item>

                <Form.Item
                  name="body"
                  label="남기고 싶은 이야기"
                  rules={[{ required: true, message: "이야기를 적어주세요." }]}
                >
                  <TextArea rows={4} maxLength={300} showCount placeholder="오늘의 장면을 적어주세요." />
                </Form.Item>

                <Form.Item name="meetupId" label="연결할 번개 (선택)">
                  <Select
                    allowClear
                    placeholder="이 인증샷이 남은 번개"
                    options={meetups.map((meetup) => ({
                      value: meetup.id,
                      label: meetup.title,
                    }))}
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={submitting}
                >
                  피드에 올리기
                </Button>
                <p className="mt-3 text-[10.5px] leading-relaxed text-[#A8A096]">
                  데모 앱입니다. 사진 업로드 대신 준비된 샘플 사진을 사용합니다.
                </p>
              </Form>
            ),
          },
        ]}
      />
    </Drawer>
  );
}
