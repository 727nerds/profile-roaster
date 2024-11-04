import { auth, v2 } from "osu-api-extended";
import { Language, Ruleset } from "./types";

export default async function buildPrompt(username: string, ruleset: Ruleset, language: Language) {
    const user = await v2.users.details({ user: username, mode: ruleset, key: '@' });
    const scores = (await v2.scores.list({ type: 'user_best', user_id: user.id, mode: ruleset, key: '@', limit: 10 }));
    const mostPlayed = (await v2.users.beatmaps({ id: user.id, type: 'most_played', limit: 5 }));

    // Await all promises for scores
    const resolvedScores = await Promise.all(scores.map(async (score) => {
        const beatmap = await v2.beatmaps.details({ id: score.beatmap_id, type: 'difficulty' });
        return {
            beatmap_id: score.beatmap_id,
            mods: score.mods,
            info: {
                name: beatmap.beatmapset.title,
                starRating: beatmap.difficulty_rating,
                bpm: beatmap.bpm
            },
            pp: score.pp,
        }
    }));

    // Await all promises for most played
    const resolvedMostPlayed = await Promise.all(mostPlayed.map(async (beatmap) => {
        const beatmapInfo = await v2.beatmaps.details({ id: beatmap.beatmap_id!, type: 'difficulty' });
        return {
            beatmap_id: beatmap.beatmap_id,
            info: {
                name: beatmapInfo.beatmapset.title,
                starRating: beatmapInfo.difficulty_rating,
                bpm: beatmapInfo.bpm
            }
        }
    }));

    const data = {
        user: {
            pp: user.statistics.pp,
            globalRank: user.statistics.global_rank,
            countryRank: user.statistics.country_rank,
            accuracy: user.statistics.hit_accuracy,
            playCount: user.statistics.play_count,
            totalHits: user.statistics.total_hits,
            maxCombo: user.statistics.maximum_combo,
            playTime: Math.round(user.statistics.play_time / 3600),
            gradeCounts: {
                SS: user.statistics.grade_counts.ss + user.statistics.grade_counts.ssh,
                S: user.statistics.grade_counts.s + user.statistics.grade_counts.sh,
                A: user.statistics.grade_counts.a,
            },
        },
        playStyle: {
            // this sucks
            topPlays: resolvedScores.map(score => {
                const modString = score.mods.length ? 
                    ', +' + score.mods.map(mod => mod.acronym || mod).join('') : 
                    '';
                return `${score.info.name} (${score.info.starRating}★${modString}): ${score.pp}pp`;
            }).join(', '),
            mostPlayed: resolvedMostPlayed.map(map => 
                `${map.info.name} (${map.info.starRating}★)`
            ).join(', '),
            averageBpm: scores.map(score => score.beatmap.bpm).reduce((a, b) => a + b, 0) / scores.length,
            averageStarRating: (scores.map(score => score.beatmap.difficulty_rating).reduce((a, b) => a + b, 0) / scores.length).toFixed(2),
        }
    }

    // Rest of the code remains the same
    const prompt = removeSpacing`Generate an osu!-themed critique using this information. Make it mean and harsh, also mid-sized. The user has requested to receive the feedback in ${language}. Given the following player data, analyze their gameplay patterns, rank, and stats with some spice.

Player Profile Data:
- Performance Points (PP): ${data.user.pp}
- Global Rank: ${data.user.globalRank}
- Country Rank: ${data.user.countryRank}
- Accuracy: ${data.user.accuracy}%
- Play Count: ${data.user.playCount}
- Total Hits: ${data.user.totalHits}
- Maximum Combo: ${data.user.maxCombo}
- Play Time: ${data.user.playTime} hours
- Grade Distribution: ${data.user.gradeCounts.SS} SS ranks, ${data.user.gradeCounts.S} S ranks, ${data.user.gradeCounts.A} A ranks
- Average BPM of top plays: ${data.playStyle.averageBpm}
- Average Star Rating of top plays: ${data.playStyle.averageStarRating}
Their top plays are: ${data.playStyle.topPlays}
Their most played maps are: ${data.playStyle.mostPlayed}

Examples for elements to incorporate in your critique:
- Calculate and comment on their PP/hour ratio ("farming efficiency")
- Analyze their mod preferences with dramatic flair
- Highlight any suspicious patterns in their top plays
- Draw parallels to notorious osu! player archetypes based on their stats
- Over-analyze their star rating comfort zone
- Provide commentary on their grade distribution with sass
- If applicable, compare their osu!stable vs osu!lazer performance

Style guidelines:
- Use sarcasm and witty observations
- Reference well-known osu! memes and community inside jokes
- Maintain a tone that's sharp. You can make it lighthearted sometimes, but don't hold back on the criticism
- Include at least one backhanded compliment
- End with a spicy but encouraging challenge for improvement
Note that CL scores indicate osu!stable plays, while non-CL scores are from osu!lazer.`;
    return prompt;
}

// currently does nothing but oh well
function removeSpacing(strings: TemplateStringsArray, ...values: any[]) {
    return strings.map((str, i) => {
        return str + (values[i] || '');
    }).join('');
}