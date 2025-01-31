import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import { useToast } from "../../hooks/use-toast";
import { Award, Gift, ShoppingCart, Star, IceCream } from "lucide-react";
import { supabase } from "../../integrations/supabase/client";
import styles from './XPStore.module.css';

const REWARDS = [
  { 
    name: "Free Supplement Bottle", 
    cost: 5000, 
    icon: <ShoppingCart className={styles.icon} />,
    image: "/lovable-uploads/7.png"
  },
  { 
    name: "Custom Water Bottle", 
    cost: 10000, 
    icon: <Gift className={styles.icon} />,
    image: "/lovable-uploads/10.png"
  },
  { 
    name: "Custom Merch of the Month", 
    cost: 15000, 
    icon: <Star className={styles.icon} />,
    image: "/lovable-uploads/8.png"
  },
  { 
    name: "Fitness Class (F45/Barry's/Spincycle)", 
    cost: 20000, 
    icon: <Award className={styles.icon} />,
    emoji: "🚲"
  },
  { 
    name: "$100 Alo Gift Card", 
    cost: 25000, 
    icon: <Gift className={styles.icon} />,
    image: "/lovable-uploads/11.png"
  },
  { 
    name: "Ninja Creami Ice Cream Maker", 
    cost: 30000, 
    icon: <IceCream className={styles.icon} />,
    image: "/lovable-uploads/9.png"
  },
];

export const XPStore = () => {
  const { toast } = useToast();
  const [userXP, setUserXP] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUserXP();
  }, []);

  const fetchUserXP = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_xp')
        .select('total_xp')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setUserXP(data?.total_xp || 0);
    } catch (error) {
      console.error('Error fetching XP:', error);
    }
  };

  const handleRedeemReward = async (reward) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (userXP < reward.cost) {
        toast({
          title: "Insufficient XP",
          description: `You need ${reward.cost - userXP} more XP to redeem this reward.`,
          variant: "destructive",
        });
        return;
      }

      const { error: redemptionError } = await supabase
        .from('reward_redemptions')
        .insert({
          user_id: user.id,
          reward_type: reward.name,
          xp_cost: reward.cost,
        });

      if (redemptionError) throw redemptionError;

      const { error: updateError } = await supabase
        .from('user_xp')
        .update({ total_xp: userXP - reward.cost })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await fetchUserXP();
      
      toast({
        title: "Reward Redeemed!",
        description: `You've successfully redeemed ${reward.name}. Our team will contact you soon.`,
      });
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast({
        title: "Error",
        description: "Failed to redeem reward. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={styles.card}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>XP Store</h3>
            <p className={styles.subtitle}>
              Redeem your XP for exclusive rewards
            </p>
          </div>
          <div className={styles.xpBadge}>
            <Star className={styles.starIcon} />
            <span className={styles.xpText}>{userXP} XP</span>
          </div>
        </div>

        <div className={styles.rewardsGrid}>
          {REWARDS.map((reward, index) => (
            <Card key={index} className={styles.rewardCard}>
              <div className={styles.rewardContent}>
                {reward.image ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className={styles.imageContainer}>
                        <img 
                          src={reward.image} 
                          alt={reward.name}
                          className={styles.rewardImage}
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className={styles.dialogContent}>
                      <img 
                        src={reward.image} 
                        alt={reward.name}
                        className={styles.dialogImage}
                      />
                    </DialogContent>
                  </Dialog>
                ) : reward.emoji ? (
                  <div className={styles.emojiContainer}>
                    {reward.emoji}
                  </div>
                ) : (
                  <div className={styles.iconContainer}>
                    {reward.icon}
                  </div>
                )}
                <div className={styles.rewardDetails}>
                  <h4 className={styles.rewardName}>
                    {reward.name}
                  </h4>
                  <p className={styles.rewardCost}>
                    {reward.cost} XP
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading || userXP < reward.cost}
                    onClick={() => handleRedeemReward(reward)}
                    className={styles.redeemButton}
                  >
                    Redeem
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className={styles.xpEarningSection}>
          <h4 className={styles.xpEarningTitle}>How to Earn XP</h4>
          <ul className={styles.xpEarningList}>
            <li className={styles.xpEarningItem}>
              <span>Daily Supplement Log</span>
              <span className={styles.xpAmount}>10 XP</span>
            </li>
            <li className={styles.xpEarningItem}>
              <span>Daily Quiz</span>
              <span className={styles.xpAmount}>50 XP</span>
            </li>
            <li className={styles.xpEarningItem}>
              <span>Refer a Friend</span>
              <span className={styles.xpAmount}>500 XP</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};