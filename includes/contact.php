<section id="contact" class="border-t border-term-border py-20">
    <div class="mx-auto max-w-5xl px-4">
        <header class="reveal mb-8">
            <p class="text-sm text-term-dim">
                <span class="text-term-green">$</span> ./contact.sh
            </p>
            <h2 class="mt-2 text-2xl font-bold text-term-bright sm:text-3xl">// Contact</h2>
        </header>

        <div class="reveal rounded-lg border border-term-border bg-term-panel p-6 sm:p-8">
            <p class="text-term-muted">
                <span class="text-term-green">&gt;</span>
                Une idée de projet, une opportunité, ou juste envie d'échanger ?
                N'hésitez pas à me contacter.
            </p>

            <?php if (!empty($profile['email'])): ?>
                <a href="mailto:<?= e($profile['email']) ?>"
                   class="mt-6 inline-flex items-center gap-2 rounded border border-term-green bg-term-green/10 px-4 py-2 text-sm text-term-bright transition-colors hover:bg-term-green hover:text-term-bg">
                    <span>mail</span>
                    <span class="text-term-dim group-hover:text-term-bg"><?= e($profile['email']) ?></span>
                </a>
            <?php endif; ?>

            <?php if (!empty($profile['socials'])): ?>
                <div class="mt-8 border-t border-term-border pt-6">
                    <p class="mb-4 text-xs text-term-dim">// liens</p>
                    <ul class="grid gap-3 sm:grid-cols-3">
                        <?php foreach ($profile['socials'] as $social): ?>
                            <li>
                                <a href="<?= e($social['url'] ?? '#') ?>" target="_blank" rel="noopener"
                                   class="group flex flex-col rounded border border-term-border p-3 transition-colors hover:border-term-green">
                                    <span class="text-sm text-term-bright"><?= e($social['label'] ?? '') ?></span>
                                    <span class="mt-1 text-xs text-term-dim">
                                        <span class="text-term-green">$</span> <?= e($social['command'] ?? '') ?>
                                    </span>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>
