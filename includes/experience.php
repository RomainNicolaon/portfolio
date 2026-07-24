<?php /** @var array $experiences */ $experiences = $experiences ?? []; ?>
<section id="experience" class="border-t border-term-border py-20">
    <div class="mx-auto max-w-5xl px-4">
        <header class="reveal mb-10">
            <p class="text-sm text-term-dim">
                <span class="text-term-green">$</span> cat experiences.json
            </p>
            <h2 class="mt-2 text-2xl font-bold text-term-bright sm:text-3xl">// Expériences</h2>
        </header>

        <div class="relative space-y-6 border-l border-term-border pl-6 sm:pl-8">
            <?php foreach ($experiences as $job): ?>
                <article class="reveal relative rounded-lg border border-term-border bg-term-panel p-5 transition-colors hover:border-term-dim">
                    <span class="absolute -left-[calc(1.5rem+7px)] top-6 h-3.5 w-3.5 rounded-full border-2 border-term-bg bg-term-green sm:-left-[calc(2rem+7px)]"></span>

                    <div class="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                        <h3 class="text-lg font-bold text-term-bright">
                            <?= e($job['role'] ?? '') ?>
                            <span class="text-term-dim">@</span>
                            <a href="<?= e($job['url'] ?? '#') ?>" class="text-term-green hover:underline"><?= e($job['company'] ?? '') ?></a>
                        </h3>
                        <span class="whitespace-nowrap text-xs text-term-dim"><?= e($job['period'] ?? '') ?></span>
                    </div>

                    <p class="mt-1 text-xs text-term-dim"><?= e($job['location'] ?? '') ?></p>
                    <p class="mt-3 text-sm text-term-muted"><?= e($job['description'] ?? '') ?></p>

                    <?php if (!empty($job['highlights'])): ?>
                        <ul class="mt-3 space-y-1.5 text-sm text-term-muted">
                            <?php foreach ($job['highlights'] as $highlight): ?>
                                <li class="flex gap-2">
                                    <span class="text-term-green">▹</span>
                                    <span><?= e($highlight) ?></span>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    <?php endif; ?>

                    <?php if (!empty($job['stack'])): ?>
                        <div class="mt-4 flex flex-wrap gap-2">
                            <?php foreach ($job['stack'] as $tech): ?>
                                <span class="rounded border border-term-border px-2 py-0.5 text-xs text-term-dim"><?= e($tech) ?></span>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
