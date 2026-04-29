/**
 * DEV-ONLY seed endpoint. Remove before production.
 * Call: GET /api/dev/seed
 * Inserts 10 kudos using the currently authenticated user.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = user.id;
  const userName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "Sunner";

  // Ensure user profile exists
  await supabase.from("users").upsert({
    id: userId,
    name: userName,
    avatar_url: user.user_metadata?.avatar_url ?? null,
  }, { onConflict: "id" });

  const messages = [
    { title: "Outstanding teamwork", msg: "Cảm ơn bạn đã hỗ trợ mình rất nhiều trong sprint vừa rồi. Nhờ bạn mà tụi mình đã hoàn thành đúng deadline. Mình rất trân trọng tinh thần nhiệt huyết và sự tận tâm của bạn!", tags: ["Dedicated", "Inspiring"], hearts: 42 },
    { title: "Great leadership", msg: "Bạn đã dẫn dắt team vượt qua giai đoạn khó khăn nhất của dự án một cách xuất sắc. Phong cách lãnh đạo bình tĩnh, sáng suốt của bạn truyền cảm hứng cho toàn team.", tags: ["Inspiring"], hearts: 28, anon: true },
    { title: "Creative problem solving", msg: "Cách bạn giải quyết vấn đề kỹ thuật hôm qua thật sự ấn tượng. Bạn đã tìm ra hướng đi mà không ai nghĩ tới và giúp team tiết kiệm rất nhiều thời gian.", tags: ["Creative"], hearts: 15 },
    { title: "Mentor of the month", msg: "Cảm ơn bạn đã dành thời gian chia sẻ kiến thức trong suốt tháng qua. Nhờ bạn mà mình đã hiểu sâu hơn về kiến trúc hệ thống và tự tin hơn khi xử lý các task phức tạp.", tags: ["Inspiring", "Dedicated"], hearts: 67 },
    { title: "Above and beyond", msg: "Bạn đã làm việc thêm giờ để đảm bảo release được đúng hạn. Sự cống hiến và trách nhiệm của bạn thực sự đáng được ghi nhận. Team rất may mắn khi có bạn đồng hành.", tags: ["Dedicated"], hearts: 33 },
    { title: "Always helpful", msg: "Bất cứ khi nào mình gặp khó khăn, bạn luôn sẵn lòng giúp đỡ. Tinh thần hợp tác và chia sẻ kiến thức của bạn thực sự làm cho môi trường làm việc trở nên tốt hơn.", tags: ["Teamwork", "Inspiring"], hearts: 19 },
    { title: "Amazing code quality", msg: "Code review của bạn luôn cực kỳ chất lượng và chi tiết. Nhờ những góp ý của bạn mà chất lượng codebase của team đã được cải thiện đáng kể.", tags: ["Dedicated"], hearts: 24 },
    { title: "Quick learner", msg: "Chỉ trong một tuần, bạn đã nắm bắt được toàn bộ domain knowledge của dự án. Khả năng học hỏi nhanh và thái độ tích cực của bạn thực sự đáng khâm phục.", tags: ["Creative", "Inspiring"], hearts: 11 },
    { title: "Best teammate ever", msg: "Làm việc cùng bạn là một trong những trải nghiệm tuyệt vời nhất trong sự nghiệp của mình. Sự chuyên nghiệp, nhiệt huyết và tâm huyết của bạn luôn là nguồn cảm hứng.", tags: ["Teamwork", "Dedicated"], hearts: 55 },
    { title: "Problem solver extraordinaire", msg: "Mỗi khi gặp một bug khó, bạn là người đầu tiên mình nghĩ đến. Khả năng debug và tìm root cause của bạn thực sự ở một đẳng cấp khác.", tags: ["Creative"], hearts: 38 },
  ];

  const inserted: number[] = [];
  const errors: string[] = [];

  for (const m of messages) {
    const { data, error } = await supabase.from("kudos").insert({
      sender_id: userId,
      recipient_id: userId,
      title: m.title,
      message: m.msg,
      hashtags: m.tags,
      image_urls: [],
      heart_count: m.hearts,
      is_anonymous: m.anon ?? false,
      idempotency_key: crypto.randomUUID(),
    }).select("id").single();

    if (error) {
      errors.push(`${m.title}: ${error.message}`);
    } else if (data) {
      inserted.push(data.id);
    }
  }

  return NextResponse.json({
    success: true,
    message: `Inserted ${inserted.length} kudos for user ${userName}`,
    kudosIds: inserted,
    errors,
  });
}
