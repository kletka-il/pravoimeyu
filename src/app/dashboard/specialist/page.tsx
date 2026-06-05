import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ROLE, SPECIALIST_STATUS_LABEL, type SpecialistStatus } from "@/lib/constants";
import SpecialistProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function SpecialistDashboard() {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.SPECIALIST) redirect("/dashboard");

  const [profile, articlesCount] = await Promise.all([
    prisma.specialistProfile.findUnique({ where: { userId: s.userId } }),
    prisma.article.count({ where: { authorId: s.userId } }),
  ]);

  if (!profile) {
    return (
      <div className="card">
        Профиль юриста не найден. Свяжитесь со службой поддержки.
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="card">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="heading-serif text-2xl">Профиль юриста</h2>
            <span
              className={`badge ${
                profile.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : profile.status === "PENDING"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300"
              }`}
            >
              {SPECIALIST_STATUS_LABEL[profile.status as SpecialistStatus]}
            </span>
          </div>
          <p className="text-sm text-ink-500 mt-1">
            Информация ниже отображается клиентам в карточке поиска и на странице
            статей по вашей специализации.
          </p>
        </div>

        <SpecialistProfileForm
          initial={{
            yearsExperience: profile.yearsExperience,
            bio: profile.bio,
            city: profile.city,
            phone: profile.phone,
            pricePerHour: profile.pricePerHour,
            specializations: (() => { const v = profile.specializations; return Array.isArray(v) ? v : typeof v === "string" ? (() => { try { return JSON.parse(v); } catch { return []; } })() : []; })() as string[],
            credentials: (() => { const v = profile.credentials; return Array.isArray(v) ? v : typeof v === "string" ? (() => { try { return JSON.parse(v); } catch { return []; } })() : []; })() as string[],
          }}
        />
      </div>

      <aside className="space-y-4">
        <div className="card">
          <h3 className="heading-serif text-xl mb-2">Рейтинг</h3>
          <div className="text-3xl font-serif text-accent">
            ★ {profile.rating.toFixed(1)}
          </div>
          <div className="text-sm text-ink-500 mt-1">
            {profile.reviewsCount} отзывов
          </div>
        </div>
        <Link
          href="/dashboard/specialist/articles"
          className="card card-hover block group"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">✍️</span>
            <div>
              <h3 className="heading-serif text-lg mb-0.5 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                Мои статьи
              </h3>
              <p className="text-sm text-ink-500">
                {articlesCount > 0
                  ? `${articlesCount} ${articlesCount === 1 ? "статья" : articlesCount < 5 ? "статьи" : "статей"}`
                  : "Делитесь знаниями — помогайте людям"}
              </p>
            </div>
          </div>
        </Link>

        <div className="card">
          <h3 className="heading-serif text-xl mb-2">Что дальше</h3>
          <ul className="text-sm text-ink-600 list-disc pl-5 space-y-1">
            <li>Заполните регалии полностью — это повышает доверие.</li>
            <li>Укажите конкретные специализации.</li>
            <li>После одобрения профиль начнёт показываться в поиске.</li>
            <li>Пишите статьи — они увеличивают видимость профиля.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
