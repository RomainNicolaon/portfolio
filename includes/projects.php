<?php

/** @var array $projects */ $projects = $projects ?? []; ?>
<section id="projects" class="border-t border-term-border py-20">
    <div class="mx-auto max-w-5xl px-4">
        <header class="reveal mb-10">
            <p class="text-sm text-term-dim">
                <span class="text-term-green">$</span> ls -la ~/projects
            </p>
            <h2 class="mt-2 text-2xl font-bold text-term-bright sm:text-3xl">// Projets</h2>
        </header>

        <div class="grid gap-5 sm:grid-cols-2">
            <?php foreach ($projects as $project): ?>
                <article class="reveal group flex flex-col rounded-lg border border-term-border bg-term-panel p-5 transition-all hover:border-term-green hover:shadow-lg hover:shadow-term-green/10">
                    <div class="flex items-start justify-between gap-3">
                        <h3 class="flex items-center gap-2 text-lg font-bold text-term-bright">
                            <span class="text-term-green">&gt;_</span>
                            <?= e($project['name'] ?? '') ?>
                        </h3>
                        <span class="whitespace-nowrap rounded border border-term-border px-2 py-0.5 text-xs <?= ($project['status'] ?? '') === 'actif' ? 'text-term-green' : 'text-term-dim' ?>">
                            <?= e($project['status'] ?? '') ?>
                        </span>
                    </div>

                    <p class="mt-3 flex-1 text-sm text-term-muted"><?= e($project['description'] ?? '') ?></p>

                    <?php if (!empty($project['tags'])): ?>
                        <div class="mt-4 flex flex-wrap gap-2">
                            <?php foreach ($project['tags'] as $tag): ?>
                                <span class="text-xs text-term-dim">#<?= e($tag) ?></span>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>

                    <div class="mt-4 flex items-center gap-4 border-t border-term-border pt-4 text-sm">
                        <span class="text-xs text-term-dim"><?= e($project['year'] ?? '') ?></span>
                        <span class="flex-1"></span>
                        <?php $isPrivate = ($project['status'] ?? '') === 'privé'; ?>
                        <?php if ($isPrivate): ?>
                            <span class="text-xs text-term-dim">🔒 privé</span>
                        <?php else: ?>
                            <?php if (!empty($project['links']['source'])): ?>
                                <a href="<?= e($project['links']['source']) ?>" class="text-term-muted transition-colors hover:text-term-bright" target="_blank" rel="noopener">git clone</a>
                            <?php endif; ?>
                            <?php if (!empty($project['links']['demo'])): ?>
                                <a href="<?= e($project['links']['demo']) ?>" class="text-term-green transition-colors hover:text-term-bright" target="_blank" rel="noopener">./demo</a>
                            <?php endif; ?>
                        <?php endif; ?>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>