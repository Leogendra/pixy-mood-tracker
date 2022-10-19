import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Activity } from "react-native-feather";
import MenuList from "../../components/MenuList";
import MenuListItem from "../../components/MenuListItem";
import useColors from "../../hooks/useColors";
import { LogItem } from "../../hooks/useLogs";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useStatistics } from "../../hooks/useStatistics";
import { MoodAvgCard } from "./MoodAvgCard";
import { MoodPeaksCard } from "./MoodPeaksCards";
import { Subtitle } from "./Subtitle";
import { TagPeaksCard } from "./TagPeaksCards";
import { TagsDistributionCard } from "./TagsDistributionCard";
import { Title } from "./Title";
import { MoodAvgData } from "../../hooks/useStatistics/MoodAvg";
import { t } from "../../helpers/translation";

export const HighlightsSection = ({ items }: { items: LogItem[] }) => {
  const colors = useColors();
  const navigation = useNavigation();
  const analytics = useAnalytics();
  const statistics = useStatistics();
  
  const showMoodAvg =
    statistics.isAvailable("mood_avg") &&
    statistics.state.moodAvgData.ratingHighestPercentage > 60;

  const showMoodPeaksPositve =
    statistics.isAvailable("mood_peaks_positive") &&
    statistics.state.moodPeaksPositiveData.items.length >= 2;

  const showMoodPeaksNegative =
    statistics.isAvailable("mood_peaks_negative") &&
    statistics.state.moodPeaksNegativeData.items.length >= 2;

  const showTagPeaks =
    statistics.isAvailable("tags_peaks") &&
    statistics.state.tagsPeaksData.tags.filter((tag) => tag.items.length > 5).length > 0;

  const showTagsDistribution =
    statistics.isAvailable("tags_distribution") &&
    statistics.state.tagsDistributionData.itemsCount >= 10;

  useEffect(() => {
    if(!statistics.state.loaded) return;
    
    const cards: {
      mood_avg_show: boolean;
      mood_avg_type?: MoodAvgData['ratingHighestKey']
      mood_avg_percentage?: MoodAvgData['ratingHighestPercentage']
      mood_peaks_positive_show: boolean;
      mood_peaks_positive_count?: number
      mood_peaks_negative_show: boolean;
      mood_peaks_negative_count?: number
      tags_peaks_show: boolean;
      tags_peaks_count?: number
      tags_distribution_show: boolean;
      tags_distribution_tag_count?: number;
      tags_distribution_item_count?: number
    } = {
      mood_avg_show: showMoodAvg,
      mood_peaks_positive_show: showMoodPeaksPositve,
      mood_peaks_negative_show: showMoodPeaksNegative,
      tags_peaks_show: showTagPeaks,
      tags_distribution_show: showTagsDistribution,
    }
    
    if(showMoodAvg) {
      cards.mood_avg_type = statistics.state.moodAvgData.ratingHighestKey
      cards.mood_avg_percentage = statistics.state.moodAvgData.ratingHighestPercentage
    }
    if(showMoodPeaksPositve) {
      cards.mood_peaks_positive_count = statistics.state.moodPeaksPositiveData.items.length
    }
    if(showMoodPeaksNegative) {
      cards.mood_peaks_negative_count = statistics.state.moodPeaksNegativeData.items.length
    }
    if(showTagPeaks) {
      cards.tags_peaks_count = statistics.state.tagsPeaksData.tags.length
    }
    if(showTagsDistribution) {
      cards.tags_distribution_tag_count = statistics.state.tagsDistributionData.tags.length
      cards.tags_distribution_item_count = statistics.state.tagsDistributionData.itemsCount
    }
    
    analytics.track('statistics_relevant_highlights', {
      itemsCount: statistics.state.itemsCount,
      ...cards
    })
  }, [JSON.stringify(statistics.state)])
    
  return (
    <>
      <Title>{t("statistics_highlights")}</Title>
      <Subtitle>{t("statistics_highlights_description")}</Subtitle>

      {statistics.isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 32,
          }}
        >
          <ActivityIndicator color={colors.loadingIndicator} />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
          }}
        >
          {(
            !showMoodAvg &&
            !showMoodPeaksPositve &&
            !showMoodPeaksNegative &&
            !showTagPeaks && 
            !showTagsDistribution
          ) && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 16,
                padding: 16,
                paddingVertical: 32,
                borderWidth: 1,
                borderColor: colors.statisticsNoDataBorder,
                borderStyle: "dashed",
              }}
            >
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 17,
                  textAlign: "center",
                }}
              >
                {t("statistics_no_highlights")}
              </Text>
            </View>
          )}

          {showMoodAvg && <MoodAvgCard data={statistics.state.moodAvgData} />}

          {showMoodPeaksPositve && (
            <MoodPeaksCard
              data={statistics.state.moodPeaksPositiveData}
              type="positive"
            />
          )}

          {showMoodPeaksNegative && (
            <MoodPeaksCard
              data={statistics.state.moodPeaksNegativeData}
              type="negative"
            />
          )}

          {showTagsDistribution && (
            <TagsDistributionCard
              data={statistics.state.tagsDistributionData}
            />
          )}

          {showTagPeaks && (
            <>
              {statistics.state.tagsPeaksData.tags
                .sort((a, b) => b.items.length - a.items.length)
                .filter((tag) => tag.items.length > 5)
                .map((tag, index) => (
                  <TagPeaksCard key={index} tag={tag} />
                ))}
            </>
          )}

          <MenuList
            style={{
              marginTop: 16,
            }}
          >
            <MenuListItem
              title={t("statistics_highlights_more")}
              isLink
              isLast
              onPress={() => navigation.navigate("StatisticsHighlights")}
              iconLeft={
                <Activity
                  width={18}
                  height={18}
                  color={colors.palette.amber[500]}
                />
              }
            />
          </MenuList>
        </View>
      )}
    </>
  );
};
