export default function OfflinePage() {
  return (
    <div className="container-page py-20 text-center">
      <div className="text-6xl mb-6">📡</div>
      <h1 className="heading-serif text-3xl mb-4">Нет подключения</h1>
      <p className="text-ink-600 max-w-md mx-auto mb-8">
        Для просмотра этой страницы необходим интернет. Статьи базы знаний, которые вы уже
        читали, доступны офлайн.
      </p>
      <a href="/knowledge" className="btn-primary">
        Открыть базу знаний
      </a>
    </div>
  );
}
