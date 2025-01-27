import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Share } from "lucide-react";
import { supabase } from "../integrations/supabase/client";
import { SupplementsGrid } from "./supplements/SupplementsGrid";
import { useToast } from "../ui/use-toast";
import styles from './SupplementPlan.module.css';
import supplementsData from '../../data/supplements.json';

export const SupplementPlan = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSupplements = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setRecommendations(supplementsData.supplementRecommendations);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('supplement_recommendations')
          .select('id, supplement_name, dosage, reason, company_name, product_url, image_url')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching supplements:', error);
          // Fallback to default recommendations
          setRecommendations(supplementsData.supplementRecommendations);
        } else {
          setRecommendations(data || supplementsData.supplementRecommendations);
        }
      } catch (error) {
        console.error('Error:', error);
        setRecommendations(supplementsData.supplementRecommendations);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplements();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'supplement_recommendations'
        },
        () => {
          fetchSupplements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My Supplement Plan',
        text: 'Check out my personalized supplement plan!',
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support sharing functionality.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading supplements...</div>;
  }

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Personalized Supplement Plan</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className={styles.shareButton}
        >
          <Share className={styles.shareIcon} />
          Share Plan
        </Button>
      </div>
      <SupplementsGrid recommendations={recommendations} />
    </Card>
  );
};